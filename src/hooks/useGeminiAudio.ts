import { useState, useRef, useCallback } from 'react';

interface UseGeminiAudioProps {
  text: string;
}

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface UseGeminiAudioReturn {
  audioStatus: AudioStatus;
  isLoading: boolean;
  error: string | null;
  start: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  resume: () => void;
}

// Function to convert PCM data to WAV format
function pcmToWav(pcmData: ArrayBuffer, sampleRate: number = 24000, channels: number = 1): ArrayBuffer {
  const pcmLength = pcmData.byteLength;
  const wavLength = 44 + pcmLength; // WAV header is 44 bytes
  
  const buffer = new ArrayBuffer(wavLength);
  const view = new DataView(buffer);
  
  // WAV Header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF'); // ChunkID
  view.setUint32(4, wavLength - 8, true); // ChunkSize
  writeString(8, 'WAVE'); // Format
  writeString(12, 'fmt '); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size (PCM = 16)
  view.setUint16(20, 1, true); // AudioFormat (PCM = 1)
  view.setUint16(22, channels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * channels * 2, true); // ByteRate
  view.setUint16(32, channels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data'); // Subchunk2ID
  view.setUint32(40, pcmLength, true); // Subchunk2Size
  
  // Copy PCM data
  const pcmView = new Uint8Array(pcmData);
  const wavView = new Uint8Array(buffer);
  wavView.set(pcmView, 44);
  
  return buffer;
}

export function useGeminiAudio({ text }: UseGeminiAudioProps): UseGeminiAudioReturn {
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioDataRef = useRef<string | null>(null);

  const generateAudio = useCallback(async (): Promise<string> => {
    if (audioDataRef.current) {
      return audioDataRef.current;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating audio for:', text.substring(0, 50) + '...');
      const startTime = Date.now();
      
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      const generationTime = (Date.now() - startTime) / 1000;
      console.log(`Audio generated in ${generationTime}s`);
      
      if (!data.success || !data.audioData) {
        throw new Error('No audio data received');
      }

      // Convert base64 to binary data
      const binaryData = atob(data.audioData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      let audioUrl: string;
      
      if (data.mimeType && data.mimeType.includes('pcm')) {
        console.log('Converting PCM to WAV...');
        // Convert PCM to WAV format
        const wavBuffer = pcmToWav(bytes.buffer, 24000, 1);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        // For other formats, try direct blob creation
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      }

      audioDataRef.current = audioUrl;
      return audioUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Audio generation error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  const start = useCallback(async () => {
    try {
      setAudioStatus('loading');
      setError(null);
      const audioUrl = await generateAudio();
      
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.removeEventListener('loadstart', () => {});
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('play', () => {});
        audioRef.current.removeEventListener('pause', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current = null;
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      const handleLoadStart = () => {
        console.log('Audio loading started');
        setAudioStatus('loading');
      };
      
      const handleCanPlay = () => {
        console.log('Audio can play');
      };
      
      const handlePlay = () => {
        console.log('Audio playing');
        setAudioStatus('playing');
      };
      
      const handlePause = () => {
        console.log('Audio paused');
        setAudioStatus('paused');
      };
      
      const handleEnded = () => {
        console.log('Audio ended');
        setAudioStatus('ended');
      };
      
      const handleError = (e: Event) => {
        console.error('Audio playback error:', e);
        const audioElement = e.target as HTMLAudioElement;
        if (audioElement && audioElement.error) {
          const errorCode = audioElement.error.code;
          const errorMessages: Record<number, string> = {
            1: 'Audio loading aborted',
            2: 'Network error occurred while loading audio',
            3: 'Audio decoding failed',
            4: 'Audio format not supported'
          };
          const errorMessage = errorMessages[errorCode] || `Audio error (code: ${errorCode})`;
          setError(errorMessage);
        } else {
          setError('Audio playback failed');
        }
        setAudioStatus('error');
      };

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Start playback
      console.log('Starting audio playback...');
      await audio.play();
    } catch (err) {
      console.error('Error starting audio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start audio';
      setError(errorMessage);
      setAudioStatus('error');
    }
  }, [generateAudio]);

  const pause = useCallback(() => {
    if (audioRef.current && audioStatus === 'playing') {
      audioRef.current.pause();
    }
  }, [audioStatus]);

  const resume = useCallback(() => {
    if (audioRef.current && audioStatus === 'paused') {
      audioRef.current.play().catch(err => {
        console.error('Error resuming audio:', err);
        setError('Failed to resume audio');
        setAudioStatus('error');
      });
    }
  }, [audioStatus]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioStatus('idle');
    }
  }, []);

  return {
    audioStatus,
    isLoading,
    error,
    start,
    pause,
    stop,
    resume,
  };
} 