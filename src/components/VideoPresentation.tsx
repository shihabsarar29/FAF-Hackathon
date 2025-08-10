'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Interfaces
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

interface EnvironmentalEffect {
  effectNumber: number;
  category: string;
  title: string;
  videoScript?: string;
  description?: string;
  imagePrompt?: string;
  videoGenPrompt?: string;
  isDetailed?: boolean;
}

interface HealthEffect {
  effectNumber: number;
  category: string;
  title: string;
  videoScript?: string;
  description?: string;
  imagePrompt?: string;
  videoGenPrompt?: string;
  isDetailed?: boolean;
}

interface HistoryOrigin {
  originNumber: number;
  period: string;
  title: string;
  videoScript?: string;
  description?: string;
  imagePrompt?: string;
  videoGenPrompt?: string;
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

interface VideoPresentationProps {
  items: (SupplyChainStep | EnvironmentalEffect | HealthEffect | HistoryOrigin)[];
  images: GeneratedImage[];
  audioData: GeneratedAudio[];
  contentType: 'supply-chain' | 'environmental' | 'health' | 'history';
}

// Video-like presentation component
export default function VideoPresentation({ items, images, audioData, contentType }: VideoPresentationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [stepDurations, setStepDurations] = useState<{ [stepNumber: number]: number }>({}); // Actual durations
  const [totalDuration, setTotalDuration] = useState(0); // Total presentation duration
  const [absoluteCurrentTime, setAbsoluteCurrentTime] = useState(0); // Absolute time in presentation

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const previousAudioStatusRef = React.useRef<string>('idle');
  const currentAudioStatusRef = React.useRef<string>('idle');

  // Helper function to get the ID from any item type
  const getItemId = (item: SupplyChainStep | EnvironmentalEffect | HealthEffect | HistoryOrigin | undefined): number => {
    if (!item) return 0;
    if ('stepNumber' in item) return item.stepNumber;
    if ('effectNumber' in item) return item.effectNumber;
    if ('originNumber' in item) return item.originNumber;
    return 0;
  };

  // Helper function to get the stage/category from any item type
  const getItemStage = (item: SupplyChainStep | EnvironmentalEffect | HealthEffect | HistoryOrigin | undefined): string => {
    if (!item) return '';
    if ('stage' in item) return item.stage;
    if ('category' in item) return item.category;
    if ('period' in item) return item.period;
    return '';
  };

  // Get items that have both images and audio
  const presentationItems = items.filter(item => {
    const itemId = getItemId(item);
    const hasImage = images.some(img => img.stepNumber === itemId && img.success);
    const hasAudio = audioData.some((audio: GeneratedAudio) => audio.stepNumber === itemId && audio.success);
    return item.isDetailed && item.videoScript && hasImage && hasAudio;
  });

  // Calculate step start times and total duration based on actual or estimated durations
  const { stepStartTimes, totalTime } = React.useMemo(() => {
    const times: number[] = [0];
    let cumulativeTime = 0;
    
    presentationItems.forEach((item, index) => {
      // Use actual duration if available, otherwise estimate 5 seconds
      const stepDuration = stepDurations[getItemId(item)] || 5;
      cumulativeTime += stepDuration;
      if (index < presentationItems.length - 1) {
        times.push(cumulativeTime);
      }
    });
    
    return { stepStartTimes: times, totalTime: cumulativeTime };
  }, [presentationItems, stepDurations]);

  // Update total duration when it changes
  React.useEffect(() => {
    setTotalDuration(totalTime);
  }, [totalTime]);

  // Calculate linear progress based on absolute time position
  const progress = React.useMemo(() => {
    if (totalDuration === 0) return 0;
    return Math.min((absoluteCurrentTime / totalDuration) * 100, 100);
  }, [absoluteCurrentTime, totalDuration]);

  // Helper function to format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format current and total time
  const currentTimeFormatted = formatTime(absoluteCurrentTime);
  const totalTimeFormatted = formatTime(totalDuration);

  const currentStepData = presentationItems[currentStep];
  const currentImage = currentStepData ? images.find(img => img.stepNumber === getItemId(currentStepData)) : undefined;
  const currentAudio = currentStepData ? audioData.find((audio: GeneratedAudio) => audio.stepNumber === getItemId(currentStepData)) : undefined;

  // Function to play pre-generated audio
  const playCurrentStepAudio = React.useCallback(async () => {
    if (!currentAudio || !currentAudio.success || !currentAudio.audioData) {
      console.error('No audio data available for current step:', getItemId(currentStepData));
      setAudioStatus('error');
      setAudioError('No audio data available');
      return;
    }

    try {
      setAudioStatus('loading');
      setAudioError(null);
      console.log(`Loading audio for step ${getItemId(currentStepData)}...`);

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

      // Create audio blob (OpenAI returns MP3 format)
      const blob = new Blob([bytes], { type: currentAudio.mimeType || 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners with proper cleanup
      const handlePlay = () => {
        console.log(`[AUDIO] Audio started playing for step ${getItemId(currentStepData)}`);
        setAudioStatus('playing');
        currentAudioStatusRef.current = 'playing';
      };
      
      const handlePause = () => {
        console.log(`[AUDIO] Audio paused for step ${getItemId(currentStepData)}`);
        setAudioStatus('paused');
        currentAudioStatusRef.current = 'paused';
      };
      
      const handleEnded = () => {
        console.log(`[AUDIO] Audio ended for step ${getItemId(currentStepData)}`);
        setAudioStatus('ended');
        currentAudioStatusRef.current = 'ended';
        // Clean up blob URL to prevent memory leaks
        URL.revokeObjectURL(audioUrl);
      };
      
      const handleTimeUpdate = () => {
        if (audio.currentTime > 0 && audio.duration > 0) {
          const progress = (audio.currentTime / audio.duration) * 100;
          const timeLeft = audio.duration - audio.currentTime;
          
          // Update absolute time within current step only, but ensure it never goes backward
          const stepStartTime = stepStartTimes[getItemId(currentStepData)] || 0;
          const absoluteTime = stepStartTime + audio.currentTime;
          
          // Only update if the new time is greater than current time (prevents backward jumps)
          setAbsoluteCurrentTime(prevTime => Math.max(prevTime, absoluteTime));
          
          // Log progress when near the end
          if (progress > 95) {
            console.log(`[AUDIO] Audio ${progress.toFixed(1)}% complete for step ${getItemId(currentStepData)}, ${timeLeft.toFixed(1)}s left`);
          }
          
          // Backup mechanism: if very close to end and not already ended
          if (timeLeft < 0.1 && currentAudioStatusRef.current === 'playing') {
            console.log(`[AUDIO] Audio almost finished (${timeLeft.toFixed(3)}s left), triggering end manually`);
            handleEnded();
          }
        }
      };
      
      const handleLoadedData = () => {
        console.log(`[AUDIO] Audio loaded for step ${getItemId(currentStepData)}, duration: ${audio.duration}s`);
        
        // Store actual duration for this step
        if (audio.duration > 0 && currentStepData) {
          setStepDurations(prev => ({
            ...prev,
            [getItemId(currentStepData)]: audio.duration
          }));
        }
      };
      
      const handleError = (e: Event) => {
        console.error('[AUDIO] Audio playback error for step', getItemId(currentStepData), ':', e);
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
      console.log(`Starting audio playback for step ${getItemId(currentStepData)}...`);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio for step', getItemId(currentStepData), ':', error);
      setAudioError(error instanceof Error ? error.message : 'Failed to play audio');
      setAudioStatus('error');
    }
  }, [currentAudio, currentStepData, stepStartTimes]);

  // Detect when audio finishes and advance to next step
  React.useEffect(() => {
    const prevStatus = previousAudioStatusRef.current;
    const currStatus = audioStatus;
    
    console.log(`[AUTO-ADVANCE] Audio status: ${prevStatus} → ${currStatus} | Step: ${currentStep + 1}/${presentationItems.length} | Playing: ${isPlaying} | Paused: ${isPaused}`);
    
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
            if (prevStep < presentationItems.length - 1) {
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
  }, [audioStatus, presentationItems.length, isPlaying, isPaused]);

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
    console.log(`[DEBUG] Current state - Step: ${currentStep + 1}/${presentationItems.length}, Playing: ${isPlaying}, Paused: ${isPaused}, Audio: ${audioStatus}`);
  }, [currentStep, isPlaying, isPaused, presentationItems.length, audioStatus]);

  // Update audio status ref whenever status changes
  React.useEffect(() => {
    currentAudioStatusRef.current = audioStatus;
  }, [audioStatus]);

  const handlePlay = () => {
    if (presentationItems.length === 0) return;
    
    console.log('Starting presentation with', presentationItems.length, 'steps');
    setIsPlaying(true);
    setIsPaused(false);
    setAudioStatus('idle');
    setAudioError(null);
    setAbsoluteCurrentTime(0); // Reset absolute time
    
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
    setAbsoluteCurrentTime(0); // Reset absolute time
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    // Set absolute time to the start of the clicked step
    const stepStartTime = stepStartTimes[stepIndex] || 0;
    setAbsoluteCurrentTime(stepStartTime);
    if (isPlaying && !isPaused) {
      // Will trigger audio playback via useEffect
    }
  };

  if (presentationItems.length === 0) {
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Video-like Presentation ({presentationItems.length} {contentType === 'supply-chain' ? 'steps' : contentType === 'history' ? 'periods' : 'effects'})</CardTitle>
        <CardDescription>
          Watch the {contentType === 'supply-chain' ? 'supply chain steps' : contentType === 'environmental' ? 'environmental effects' : contentType === 'health' ? 'health effects' : 'historical origins'} with synchronized images and narration
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
                alt={currentStepData ? `Step ${getItemId(currentStepData)}: ${currentStepData.title}` : 'Loading...'}
                className="w-full h-full object-cover"
                onError={(_e) => {
                  console.error('Video presentation image load error:', currentImage.imageData);
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">
                  {currentStepData ? `${contentType === 'supply-chain' ? 'Step' : 'Effect'} ${getItemId(currentStepData)}: ${getItemStage(currentStepData)}` : 'Loading...'}
                </h3>
                <p className="text-gray-200 text-sm">{currentStepData?.title || 'Loading...'}</p>
                
                {/* Captions */}
                {currentStepData?.videoScript && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-white text-base font-medium leading-relaxed">
                      &ldquo;{currentStepData.videoScript}&rdquo;
                    </p>
                  </div>
                )}
              </div>
              
              {/* Audio status indicator */}
              <div className="absolute top-4 right-4">
                {audioStatus === 'loading' && (
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Loading...
                  </div>
                )}
                {audioStatus === 'playing' && (
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Playing
                  </div>
                )}
                {audioStatus === 'error' && (
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Error
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
                Play Presentation
              </Button>
            ) : isPaused ? (
              <Button onClick={handleResume} className="bg-green-600 hover:bg-green-700">
                Resume
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                Pause
              </Button>
            )}
            
            <Button onClick={handleStop} variant="outline">
              Stop
            </Button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{contentType === 'supply-chain' ? 'Step' : 'Effect'} {currentStep + 1} of {presentationItems.length}</span>
              <span>{currentTimeFormatted} / {totalTimeFormatted}</span>
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
            {presentationItems.map((item, index) => (
              <button
                key={getItemId(item)}
                onClick={() => handleStepClick(index)}
                className={`p-2 text-xs rounded border text-left ${
                  index === currentStep
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="font-semibold">{contentType === 'supply-chain' ? 'Step' : 'Effect'} {getItemId(item)}</div>
                <div className="truncate">{item.title}</div>
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