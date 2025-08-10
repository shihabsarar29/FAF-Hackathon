import { useState, useRef, useCallback } from 'react';

interface UseAudioTTSProps {
  text: string;
}

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface UseAudioTTSReturn {
  audioStatus: AudioStatus;
  isLoading: boolean;
  error: string | null;
  start: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  resume: () => void;
}

export function useAudioTTS({ text }: UseAudioTTSProps): UseAudioTTSReturn {
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = useCallback(async () => {
    if (!text.trim()) {
      setError('No text provided for audio generation');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioStatus('loading');

    try {
      console.log('[TTS] Generating audio for text:', text.substring(0, 50) + '...');
      
      // Call the OpenAI TTS API
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.audioData) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      console.log('[TTS] Audio generated successfully');

      // Create audio blob from base64 data
      const binaryData = atob(data.audioData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      // Create blob with MP3 format
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      // Create and configure audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      const handlePlay = () => {
        console.log('[TTS] Audio started playing');
        setAudioStatus('playing');
        setIsLoading(false);
      };
      
      const handlePause = () => {
        console.log('[TTS] Audio paused');
        setAudioStatus('paused');
      };
      
      const handleEnded = () => {
        console.log('[TTS] Audio ended');
        setAudioStatus('ended');
        URL.revokeObjectURL(audioUrl);
      };
      
      const handleError = (e: Event) => {
        console.error('[TTS] Audio playback error:', e);
        setError('Audio playback failed');
        setAudioStatus('error');
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Start playback
      await audio.play();

    } catch (err) {
      console.error('[TTS] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setAudioStatus('error');
      setIsLoading(false);
    }
  }, [text]);

  const pause = useCallback(() => {
    if (audioRef.current && audioStatus === 'playing') {
      audioRef.current.pause();
    }
  }, [audioStatus]);

  const resume = useCallback(() => {
    if (audioRef.current && audioStatus === 'paused') {
      audioRef.current.play().catch(err => {
        console.error('[TTS] Error resuming audio:', err);
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
    resume
  };
} 