'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'; // Added for React.useEffect
import { useGeminiAudio } from '@/hooks/useGeminiAudio';

interface SupplyChainStep {
  stepNumber: number;
  stage: string;
  title: string;
  description?: string;
  imagePrompt?: string;
  videoGenPrompt?: string;
  videoScript?: string;
  isDetailed?: boolean;
}

interface GeneratedImage {
  stepNumber: number;
  stage: string;
  title: string;
  imagePrompt: string;
  imageData: {
    description?: string;
    type?: string;
    instructions?: string;
    text?: string;
    image?: string;
    mimeType?: string;
  };
  success: boolean;
  error?: string;
  modelUsed?: string;
  isImageGenerated?: boolean;
}

interface GeneratedAudio {
  stepNumber: number;
  success: boolean;
  audioData?: string;
  mimeType?: string;
  error?: string;
  generationTime?: number;
}

// Component for individual step with text-to-speech
function StepCard({ step }: { step: SupplyChainStep }) {
  const {
    audioStatus,
    isLoading,
    error,
    start: startAudio,
    pause: pauseAudio,
    stop: stopAudio,
    resume: resumeAudio,
  } = useGeminiAudio({ 
    text: step.videoScript || `Step ${step.stepNumber}: ${step.title}. ${step.description || ''}`,
  });

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {step.stepNumber}
          </span>
          <div>
            <div className="text-lg">{step.stage}</div>
            <div className="text-sm text-gray-600 font-normal">{step.title}</div>
          </div>
        </CardTitle>
        <CardDescription>
          {step.isDetailed ? 'Step details loaded' : 'Loading details...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step.isDetailed ? (
          <div>
            <h4 className="font-semibold mb-2">Description:</h4>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading detailed information...</p>
          </div>
        )}
        
        {step.isDetailed && (
          <>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Image Generation Prompt:</h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-800 text-sm font-mono">{step.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Video Generation Prompt:</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-sm font-mono">{step.videoGenPrompt}</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Video Script:</h4>
                  <div className="flex gap-2">
                    {audioStatus === "idle" || audioStatus === "ended" ? (
                      <Button 
                        onClick={startAudio} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                        disabled={!step.videoScript || isLoading}
                      >
                        {isLoading ? "⏳ Loading..." : "🔊 Play Audio"}
                      </Button>
                    ) : audioStatus === "playing" ? (
                      <Button 
                        onClick={pauseAudio} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        ⏸️ Pause
                      </Button>
                    ) : audioStatus === "paused" ? (
                      <Button 
                        onClick={resumeAudio} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        ▶️ Resume
                      </Button>
                    ) : null}
                    <Button 
                      onClick={stopAudio} 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      disabled={audioStatus === "idle"}
                    >
                      ⏹️ Stop
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700 text-sm">{step.videoScript}</p>
                  {audioStatus === "playing" && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                      Playing audio...
                    </div>
                  )}
                  {isLoading && (
                    <div className="mt-2 text-xs text-orange-600">
                      Generating audio...
                    </div>
                  )}
                  {error && (
                    <div className="mt-2 text-xs text-red-600">
                      Error: {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Component for playing all scripts in sequence
function PlayAllScripts({ steps }: { steps: SupplyChainStep[] }) {
  const allScripts = steps
    .filter(step => step.isDetailed && step.videoScript)
    .map(step => `Step ${step.stepNumber}: ${step.stage}. ${step.videoScript}`)
    .join('. ');

  const {
    audioStatus,
    isLoading,
    error,
    start: startAudio,
    pause: pauseAudio,
    stop: stopAudio,
    resume: resumeAudio,
  } = useGeminiAudio({ text: allScripts });

  const hasScripts = steps.some(step => step.isDetailed && step.videoScript);

  if (!hasScripts) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🎧 Audio Narration
          <div className="flex gap-2">
            {audioStatus === "idle" || audioStatus === "ended" ? (
              <Button 
                onClick={startAudio} 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "⏳ Loading..." : "🔊 Play All Scripts"}
              </Button>
            ) : audioStatus === "playing" ? (
              <Button 
                onClick={pauseAudio} 
                variant="outline" 
                size="sm"
              >
                ⏸️ Pause All
              </Button>
            ) : audioStatus === "paused" ? (
              <Button 
                onClick={resumeAudio} 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                ▶️ Resume All
              </Button>
            ) : null}
            <Button 
              onClick={stopAudio} 
              variant="outline" 
              size="sm"
              disabled={audioStatus === "idle"}
            >
              ⏹️ Stop All
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Listen to all video scripts narrated in sequence
          {audioStatus === "playing" && (
            <div className="mt-2 text-green-600 flex items-center gap-1">
              <div className="animate-pulse w-2 h-2 bg-green-600 rounded-full"></div>
              Playing all scripts...
            </div>
          )}
          {isLoading && (
            <div className="mt-2 text-orange-600">
              Generating audio...
            </div>
          )}
          {error && (
            <div className="mt-2 text-red-600">
              Error: {error}
            </div>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// Video-like presentation component
function VideoPresentation({ steps, images, audioData }: { 
  steps: SupplyChainStep[]; 
  images: GeneratedImage[];
  audioData: GeneratedAudio[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const previousAudioStatusRef = React.useRef<string>('idle');
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle');
  const [audioError, setAudioError] = useState<string | null>(null);
  const currentAudioStatusRef = React.useRef<string>('idle');

  // Get steps that have both images and audio
  const presentationSteps = steps.filter(step => {
    const hasImage = images.some(img => img.stepNumber === step.stepNumber && img.success);
    const hasAudio = audioData.some(audio => audio.stepNumber === step.stepNumber && audio.success);
    return step.isDetailed && step.videoScript && hasImage && hasAudio;
  });

  // Get current step data
  const currentStepData = presentationSteps[currentStep];
  const currentImage = images.find(img => img.stepNumber === currentStepData?.stepNumber);
  const currentAudio = audioData.find(audio => audio.stepNumber === currentStepData?.stepNumber);

  // Function to play pre-generated audio
  const playCurrentStepAudio = React.useCallback(async () => {
    if (!currentAudio || !currentAudio.success || !currentAudio.audioData) {
      console.error('No audio data available for current step:', currentStepData?.stepNumber);
      setAudioStatus('error');
      setAudioError('No audio data available');
      return;
    }

    // Function to convert PCM to WAV (moved inside useCallback)
    const pcmToWav = (pcmData: ArrayBuffer, sampleRate: number = 24000, channels: number = 1): ArrayBuffer => {
      const pcmLength = pcmData.byteLength;
      const wavLength = 44 + pcmLength;
      
      const buffer = new ArrayBuffer(wavLength);
      const view = new DataView(buffer);
      
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, wavLength - 8, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, channels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * channels * 2, true);
      view.setUint16(32, channels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, pcmLength, true);
      
      const pcmView = new Uint8Array(pcmData);
      const wavView = new Uint8Array(buffer);
      wavView.set(pcmView, 44);
      
      return buffer;
    };

    try {
      setAudioStatus('loading');
      setAudioError(null);
      console.log(`Loading audio for step ${currentStepData?.stepNumber}...`);

      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Remove all event listeners
        audioRef.current.removeEventListener('play', () => {});
        audioRef.current.removeEventListener('pause', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current = null;
      }

      // Convert base64 to binary data
      const binaryData = atob(currentAudio.audioData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      let audioUrl: string;
      
      if (currentAudio.mimeType && currentAudio.mimeType.includes('pcm')) {
        console.log('Converting pre-generated PCM to WAV...');
        const wavBuffer = pcmToWav(bytes.buffer, 24000, 1);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        const blob = new Blob([bytes], { type: currentAudio.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners with proper cleanup
      const handlePlay = () => {
        console.log(`[AUDIO] Audio started playing for step ${currentStepData?.stepNumber}`);
        setAudioStatus('playing');
        currentAudioStatusRef.current = 'playing';
      };
      
      const handlePause = () => {
        console.log(`[AUDIO] Audio paused for step ${currentStepData?.stepNumber}`);
        setAudioStatus('paused');
        currentAudioStatusRef.current = 'paused';
      };
      
      const handleEnded = () => {
        console.log(`[AUDIO] Audio ended for step ${currentStepData?.stepNumber}`);
        setAudioStatus('ended');
        currentAudioStatusRef.current = 'ended';
        // Clean up blob URL to prevent memory leaks
        URL.revokeObjectURL(audioUrl);
      };
      
      const handleTimeUpdate = () => {
        if (audio.currentTime > 0 && audio.duration > 0) {
          const progress = (audio.currentTime / audio.duration) * 100;
          const timeLeft = audio.duration - audio.currentTime;
          
          // Log progress when near the end
          if (progress > 95) {
            console.log(`[AUDIO] Audio ${progress.toFixed(1)}% complete for step ${currentStepData?.stepNumber}, ${timeLeft.toFixed(1)}s left`);
          }
          
          // Backup mechanism: if very close to end and not already ended
          if (timeLeft < 0.1 && currentAudioStatusRef.current === 'playing') {
            console.log(`[AUDIO] Audio almost finished (${timeLeft.toFixed(3)}s left), triggering end manually`);
            handleEnded();
          }
        }
      };
      
      const handleLoadedData = () => {
        console.log(`[AUDIO] Audio loaded for step ${currentStepData?.stepNumber}, duration: ${audio.duration}s`);
      };
      
      const handleError = (e: Event) => {
        console.error('[AUDIO] Audio playback error for step', currentStepData?.stepNumber, ':', e);
        const audioElement = e.target as HTMLAudioElement;
        if (audioElement && audioElement.error) {
          console.error('[AUDIO] Audio error details:', audioElement.error);
        }
        setAudioError('Audio playback failed');
        setAudioStatus('error');
        URL.revokeObjectURL(audioUrl);
      };

      // Add all event listeners
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('error', handleError);

      // Ensure audio can play through
      audio.preload = 'auto';
      audio.load(); // Force load the audio

      // Start playback
      console.log(`Starting audio playback for step ${currentStepData?.stepNumber}...`);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio for step', currentStepData?.stepNumber, ':', error);
      setAudioError(error instanceof Error ? error.message : 'Failed to play audio');
      setAudioStatus('error');
    }
  }, [currentAudio, currentStepData]);

  // Detect when audio finishes and advance to next step
  React.useEffect(() => {
    const prevStatus = previousAudioStatusRef.current;
    const currStatus = audioStatus;
    
    console.log(`[AUTO-ADVANCE] Audio status: ${prevStatus} → ${currStatus} | Step: ${currentStep + 1}/${presentationSteps.length} | Playing: ${isPlaying} | Paused: ${isPaused}`);
    
    const audioJustFinished = (
      (prevStatus === "playing" && currStatus === "ended") ||
      (prevStatus === "paused" && currStatus === "ended") ||
      (currStatus === "ended" && (prevStatus === "playing" || prevStatus === "paused"))
    );

    if (audioJustFinished) {
      console.log(`[AUTO-ADVANCE] Audio finished detected for step ${currentStep + 1} (${prevStatus} → ${currStatus})`);
      
      if (isPlaying && !isPaused) {
        console.log(`[AUTO-ADVANCE] Conditions met, advancing...`);
        
        // Use a shorter timeout for more responsive advancement
        setTimeout(() => {
          setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            if (prevStep < presentationSteps.length - 1) {
              console.log(`[AUTO-ADVANCE] Advancing from step ${prevStep + 1} to step ${nextStep + 1}`);
              return nextStep;
            } else {
              console.log('[AUTO-ADVANCE] Presentation finished - reached last step');
              setIsPlaying(false);
              return 0;
            }
          });
        }, 200); // Reduced timeout for faster response
      } else {
        console.log(`[AUTO-ADVANCE] Not advancing - isPlaying: ${isPlaying}, isPaused: ${isPaused}`);
      }
    }

    // Always update the ref at the end
    previousAudioStatusRef.current = currStatus;
  }, [audioStatus, presentationSteps.length, isPlaying, isPaused]);

  // Play audio when current step changes during presentation
  React.useEffect(() => {
    console.log(`[STEP-CHANGE] Step changed to ${currentStep + 1}, isPlaying: ${isPlaying}, isPaused: ${isPaused}, hasStepData: ${!!currentStepData}`);
    
    if (isPlaying && !isPaused && currentStepData) {
      console.log(`[STEP-CHANGE] Playing audio for step ${currentStep + 1}: "${currentStepData.videoScript?.substring(0, 50)}..."`);
      // Reset audio status before playing new audio
      setAudioStatus('idle');
      setAudioError(null);
      // Small delay to ensure state is updated
      setTimeout(() => {
        playCurrentStepAudio();
      }, 100);
    } else {
      console.log(`[STEP-CHANGE] Not playing audio - conditions not met`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isPlaying, isPaused, currentStepData]);

  // Debug effect to log step changes
  React.useEffect(() => {
    console.log(`[DEBUG] Current state - Step: ${currentStep + 1}/${presentationSteps.length}, Playing: ${isPlaying}, Paused: ${isPaused}, Audio: ${audioStatus}`);
  }, [currentStep, isPlaying, isPaused, presentationSteps.length, audioStatus]);

  // Update audio status ref whenever status changes
  React.useEffect(() => {
    currentAudioStatusRef.current = audioStatus;
  }, [audioStatus]);

  const handlePlay = () => {
    if (presentationSteps.length === 0) return;
    
    console.log('Starting presentation with', presentationSteps.length, 'steps');
    setIsPlaying(true);
    setIsPaused(false);
    setAudioStatus('idle');
    setAudioError(null);
    
    if (!isPaused) {
      setCurrentStep(0);
    }
  };

  const handlePause = () => {
    console.log('Pausing presentation');
    setIsPaused(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleResume = () => {
    console.log('Resuming presentation');
    setIsPaused(false);
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.error('Error resuming audio:', err);
        setAudioError('Failed to resume audio');
        setAudioStatus('error');
      });
    }
  };

  const handleStop = () => {
    console.log('Stopping presentation');
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setAudioStatus('idle');
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (isPlaying && !isPaused) {
      // Will trigger audio playback via useEffect
    }
  };

  if (presentationSteps.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Video-like Presentation</CardTitle>
          <CardDescription>
            No steps available for presentation. Make sure you have generated both images and audio for the steps.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const progress = presentationSteps.length > 0 ? ((currentStep + 1) / presentationSteps.length) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Video-like Presentation ({presentationSteps.length} steps)</CardTitle>
        <CardDescription>
          Watch the supply chain steps with synchronized images and narration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Main presentation area */}
        <div className="bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
          {currentStepData && currentImage && (
            <div className="relative w-full h-full">
              <img
                src={(() => {
                  // Handle different image data structures
                  if (typeof currentImage.imageData === 'string') {
                    return `data:image/jpeg;base64,${currentImage.imageData}`;
                  } else if (typeof currentImage.imageData === 'object' && currentImage.imageData.image) {
                    return `data:${currentImage.imageData.mimeType || 'image/jpeg'};base64,${currentImage.imageData.image}`;
                  }
                  console.warn('Invalid image data structure:', currentImage.imageData);
                  return '';
                })()}
                alt={`Step ${currentStepData.stepNumber}: ${currentStepData.title}`}
                className="w-full h-full object-cover"
                onError={(_e) => {
                  console.error('Video presentation image load error:', currentImage.imageData);
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">
                  Step {currentStepData.stepNumber}: {currentStepData.stage}
                </h3>
                <p className="text-gray-200 text-sm">{currentStepData.title}</p>
              </div>
              
              {/* Audio status indicator */}
              <div className="absolute top-4 right-4">
                {audioStatus === 'loading' && (
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                    Loading Audio
                  </div>
                )}
                {audioStatus === 'playing' && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                    Playing
                  </div>
                )}
                {audioStatus === 'error' && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Audio Error
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {!isPlaying ? (
              <Button onClick={handlePlay} className="bg-green-600 hover:bg-green-700">
                ▶️ Play Presentation
              </Button>
            ) : isPaused ? (
              <Button onClick={handleResume} className="bg-green-600 hover:bg-green-700">
                ▶️ Resume
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                ⏸️ Pause
              </Button>
            )}
            
            <Button onClick={handleStop} variant="outline">
              ⏹️ Stop
            </Button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {presentationSteps.length}</span>
              <span>{progress.toFixed(0)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Step navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presentationSteps.map((step, index) => (
              <button
                key={step.stepNumber}
                onClick={() => handleStepClick(index)}
                className={`p-2 text-xs rounded border text-left ${
                  index === currentStep
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="font-semibold">Step {step.stepNumber}</div>
                <div className="truncate">{step.title}</div>
              </button>
            ))}
          </div>

          {audioError && (
            <div className="text-red-600 text-sm mt-2">
              Audio Error: {audioError}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [supplyChain, setSupplyChain] = useState<{ productName: string; supplyChainSteps: SupplyChainStep[] } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateSupplyChain = async () => {
    if (!productName.trim()) return;
    
    setIsLoading(true);
    setSupplyChain(null);
    setGeneratedImages([]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      });
      
      const data = await response.json();
      
      if (data.supplyChain) {
        // Set initial supply chain with basic info
        setSupplyChain(data.supplyChain);
        
        // Now generate detailed information for each step in parallel
        generateStepDetails(data.supplyChain);
      }
    } catch (error) {
      console.error('Error generating supply chain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStepDetails = async (initialSupplyChain: { productName: string; supplyChainSteps: SupplyChainStep[] }) => {
    setIsLoadingDetails(true);
    
    try {
      // Generate details for all steps in parallel
      const detailPromises = initialSupplyChain.supplyChainSteps.map(async (step) => {
        try {
          const response = await fetch('/api/generate-step-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productName: initialSupplyChain.productName,
              stepNumber: step.stepNumber,
              stage: step.stage,
              title: step.title
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            return { ...data.stepDetails, isDetailed: true };
          } else {
            return { ...step, isDetailed: false };
          }
        } catch (error) {
          console.error(`Error generating details for step ${step.stepNumber}:`, error);
          return { ...step, isDetailed: false };
        }
      });

      const detailedSteps = await Promise.all(detailPromises);
      
      // Update supply chain with detailed information
      setSupplyChain({
        ...initialSupplyChain,
        supplyChainSteps: detailedSteps
      });
    } catch (error) {
      console.error('Error generating step details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const generateImagesAndAudio = async () => {
    if (!supplyChain) return;
    
    setIsGeneratingImages(true);
    setIsGeneratingAudio(true);
    
    try {
      const detailedSteps = supplyChain.supplyChainSteps.filter(step => step.isDetailed);
      
      // Generate images and audio in parallel for each step
      const promises = detailedSteps.map(async (step) => {
        const imagePromise = fetch('/api/generate-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            steps: [step].map(s => ({
              ...s,
              prompt: s.imagePrompt || `Professional ${s.stage.toLowerCase()} process for ${supplyChain.productName}`
            }))
          }),
        });

        const audioPromise = fetch('/api/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: step.videoScript || `Step ${step.stepNumber}: ${step.title}. ${step.description || ''}`
          }),
        });

        try {
          const [imageResponse, audioResponse] = await Promise.all([imagePromise, audioPromise]);
          
          // Process image response
          let imageResult = null;
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageResult = imageData.images?.[0] || null;
          } else {
            console.error(`Image generation failed for step ${step.stepNumber}`);
          }

          // Process audio response
          let audioResult = null;
          if (audioResponse.ok) {
            const audioData = await audioResponse.json();
            if (audioData.success) {
              audioResult = {
                stepNumber: step.stepNumber,
                success: true,
                audioData: audioData.audioData,
                mimeType: audioData.mimeType,
                generationTime: audioData.generationTime
              };
            } else {
              audioResult = {
                stepNumber: step.stepNumber,
                success: false,
                error: audioData.error || 'Audio generation failed'
              };
            }
          } else {
            console.error(`Audio generation failed for step ${step.stepNumber}`);
            audioResult = {
              stepNumber: step.stepNumber,
              success: false,
              error: 'Audio generation request failed'
            };
          }

          return { image: imageResult, audio: audioResult };
        } catch (error) {
          console.error(`Error generating content for step ${step.stepNumber}:`, error);
          return {
            image: null,
            audio: {
              stepNumber: step.stepNumber,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          };
        }
      });

      // Wait for all generations to complete
      console.log(`Starting parallel generation for ${detailedSteps.length} steps...`);
      const results = await Promise.all(promises);
      
      // Separate images and audio results
      const images = results.map(r => r.image).filter(Boolean) as GeneratedImage[];
      const audioResults = results.map(r => r.audio).filter(Boolean) as GeneratedAudio[];
      
      console.log(`Generation complete: ${images.length} images, ${audioResults.length} audio files`);
      
      setGeneratedImages(images);
      setGeneratedAudio(audioResults);
      
    } catch (error) {
      console.error('Error in parallel generation:', error);
      setGeneratedImages([]);
      setGeneratedAudio([]);
    } finally {
      setIsGeneratingImages(false);
      setIsGeneratingAudio(false);
    }
  };

  // Keep the old function for backward compatibility, but redirect to new one
  const generateImages = () => generateImagesAndAudio();

  const downloadJSON = () => {
    if (!supplyChain) return;
    
    const dataStr = JSON.stringify(supplyChain, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${supplyChain.productName.replace(/\s+/g, '_')}_supply_chain.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadVideoScripts = () => {
    if (!supplyChain) return;
    
    let scriptsContent = `Supply Chain Video Scripts for ${supplyChain.productName}\n`;
    scriptsContent += '='.repeat(50) + '\n\n';
    
    supplyChain.supplyChainSteps.forEach((step) => {
      scriptsContent += `STEP ${step.stepNumber}: ${step.stage.toUpperCase()}\n`;
      scriptsContent += '-'.repeat(30) + '\n';
      scriptsContent += `Title: ${step.title}\n`;
      if (step.isDetailed) {
        scriptsContent += `Description: ${step.description}\n\n`;
        scriptsContent += `Video Script:\n${step.videoScript}\n\n`;
        scriptsContent += `Video Generation Prompt:\n${step.videoGenPrompt}\n\n`;
        scriptsContent += `Image Generation Prompt:\n${step.imagePrompt}\n\n`;
      } else {
        scriptsContent += `Status: Details not yet loaded\n`;
      }
      scriptsContent += '\n' + '='.repeat(50) + '\n\n';
    });
    
    const dataBlob = new Blob([scriptsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${supplyChain.productName.replace(/\s+/g, '_')}_video_scripts.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadImagesData = () => {
    if (!generatedImages.length) return;
    
    const dataStr = JSON.stringify(generatedImages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${supplyChain?.productName.replace(/\s+/g, '_') || 'product'}_generated_images.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supply Chain Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate step-wise supply chain procedures for any product using AI
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the name of the product to generate its supply chain procedure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter product name (e.g., Smartphone, Coffee, T-shirt)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={generateSupplyChain}
              disabled={isLoading || isLoadingDetails || !productName.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Generating Overview...' : isLoadingDetails ? 'Loading Details...' : 'Generate Supply Chain'}
            </Button>
          </CardContent>
        </Card>

        {supplyChain && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Supply Chain Procedure for: {supplyChain.productName}
                  <div className="flex gap-2">
                    <Button onClick={downloadJSON} variant="outline" size="sm">
                      Download JSON
                    </Button>
                    <Button onClick={downloadVideoScripts} variant="outline" size="sm">
                      Download All Details
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Structured data for video generation and analysis
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Image Generation Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Generate Images & Audio for Each Step
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateImages}
                      disabled={isGeneratingImages || isGeneratingAudio || isLoadingDetails || !supplyChain.supplyChainSteps.some(step => step.isDetailed)}
                      variant="default"
                      size="sm"
                    >
                      {isGeneratingImages || isGeneratingAudio ? 'Generating Content...' : 'Generate Images & Audio'}
                    </Button>
                    {generatedImages && generatedImages.length > 0 && (
                      <Button onClick={downloadImagesData} variant="outline" size="sm">
                        Download Images Data
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Generate professional images and audio narration for each supply chain step
                  {(isGeneratingImages || isGeneratingAudio) && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span>
                          {isGeneratingImages && isGeneratingAudio ? 'Generating images and audio in parallel...' : 
                           isGeneratingImages ? 'Generating images...' : 
                           'Generating audio...'}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Processing {supplyChain.supplyChainSteps.filter(step => step.isDetailed).length} steps simultaneously
                      </div>
                    </div>
                  )}
                  {generatedImages.length > 0 && (
                    <div className="mt-2 text-green-600">
                      ✅ Images: {generatedImages.filter(img => img.success).length}/{generatedImages.length} generated successfully
                    </div>
                  )}
                  {generatedAudio.length > 0 && (
                    <div className="mt-1 text-green-600">
                      🔊 Audio: {generatedAudio.filter(audio => audio.success).length}/{generatedAudio.length} generated successfully
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              {(generatedImages.length > 0 || generatedAudio.length > 0) && (
                <CardContent>
                  <div className="grid gap-4">
                    {supplyChain.supplyChainSteps.filter(step => step.isDetailed).map((step) => {
                      const image = generatedImages.find(img => img.stepNumber === step.stepNumber);
                      const audio = generatedAudio.find(aud => aud.stepNumber === step.stepNumber);
                      
                      return (
                        <div key={step.stepNumber} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-3">
                            Step {step.stepNumber}: {step.stage} - {step.title}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Image Section */}
                            <div>
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                                🖼️ Image 
                                {image?.success ? (
                                  <span className="text-green-600 text-xs">✅ Generated</span>
                                ) : image ? (
                                  <span className="text-red-600 text-xs">❌ Failed</span>
                                ) : (
                                  <span className="text-gray-500 text-xs">⏳ Pending</span>
                                )}
                              </h5>
                              
                              {image?.success && image.imageData && (
                                <div className="space-y-2">
                                  <img
                                    src={(() => {
                                      // Handle different image data structures
                                      if (typeof image.imageData === 'string') {
                                        return `data:image/jpeg;base64,${image.imageData}`;
                                      } else if (typeof image.imageData === 'object' && image.imageData.image) {
                                        return `data:${image.imageData.mimeType || 'image/jpeg'};base64,${image.imageData.image}`;
                                      }
                                      return '';
                                    })()}
                                    alt={`Generated image for ${step.title}`}
                                    className="w-full h-32 object-cover rounded border"
                                    onError={(_e) => {
                                      console.error('Image load error for step', step.stepNumber, ':', image.imageData);
                                    }}
                                  />
                                </div>
                              )}
                              
                              {image?.error && (
                                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                  Error: {image.error}
                                </div>
                              )}
                            </div>
                            
                            {/* Audio Section */}
                            <div>
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                                🔊 Audio 
                                {audio?.success ? (
                                  <span className="text-green-600 text-xs">✅ Generated</span>
                                ) : audio ? (
                                  <span className="text-red-600 text-xs">❌ Failed</span>
                                ) : (
                                  <span className="text-gray-500 text-xs">⏳ Pending</span>
                                )}
                              </h5>
                              
                              {audio?.success && audio.audioData && (
                                <div className="space-y-2">
                                  <div className="bg-green-50 p-3 rounded border">
                                    <div className="text-sm">
                                      <div className="font-medium text-green-800">Audio Ready</div>
                                      <div className="text-green-600 text-xs mt-1">
                                        Type: {audio.mimeType || 'audio/pcm'} 
                                        {audio.generationTime && ` • ${audio.generationTime.toFixed(1)}s to generate`}
                                      </div>
                                      <div className="text-gray-600 text-xs mt-1">
                                        Script: &ldquo;{step.videoScript?.substring(0, 100)}...&rdquo;
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {audio?.error && (
                                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                  Error: {audio.error}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>

            <PlayAllScripts steps={supplyChain.supplyChainSteps} />

            <VideoPresentation steps={supplyChain.supplyChainSteps} images={generatedImages} audioData={generatedAudio} />

            <div className="grid gap-6">
              {supplyChain.supplyChainSteps.map((step, index) => (
                <StepCard 
                  key={`step-${index}`} 
                  step={step} 
                />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Raw JSON Data</CardTitle>
                <CardDescription>
                  Complete structured data for API integration and video generation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(supplyChain, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
