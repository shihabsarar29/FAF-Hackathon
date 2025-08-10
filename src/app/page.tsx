'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

// Component for individual step details
function StepCard({ step }: { step: SupplyChainStep }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {step.stepNumber}
          </span>
          <div>
            <div className="text-lg">{step.stage}</div>
            <div className="text-sm text-gray-600 font-normal">{step.title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step.isDetailed ? (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Description</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Video Script</h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm italic">&ldquo;{step.videoScript}&rdquo;</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Image Prompt</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-xs font-mono">{step.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Video Prompt</h4>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-800 text-xs font-mono">{step.videoGenPrompt}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading detailed information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for environmental effects
function EnvironmentalCard({ effect }: { effect: EnvironmentalEffect }) {
  const isPositive = effect.category.toLowerCase() === 'positive';
  const cardColor = isPositive ? 'bg-green-500' : 'bg-orange-500';
  const spinnerColor = isPositive ? 'border-green-500' : 'border-orange-500';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-orange-50';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <span className={`${cardColor} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
            {effect.effectNumber}
          </span>
          <div>
            <div className="text-lg">{effect.category} Environmental Impact</div>
            <div className="text-sm text-gray-600 font-normal">{effect.title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {effect.isDetailed ? (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Description</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm">{effect.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Video Script</h4>
              <div className={`${bgColor} p-3 rounded-md`}>
                <p className="text-gray-700 text-sm italic">&ldquo;{effect.videoScript}&rdquo;</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Image Prompt</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-xs font-mono">{effect.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Video Prompt</h4>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-800 text-xs font-mono">{effect.videoGenPrompt}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-8">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${spinnerColor}`}></div>
            <p className="text-gray-600">Loading detailed information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for health effects
function HealthCard({ effect }: { effect: HealthEffect }) {
  const isPositive = effect.category.toLowerCase() === 'positive';
  const cardColor = isPositive ? 'bg-blue-500' : 'bg-red-500';
  const spinnerColor = isPositive ? 'border-blue-500' : 'border-red-500';
  const bgColor = isPositive ? 'bg-blue-50' : 'bg-red-50';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <span className={`${cardColor} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
            {effect.effectNumber}
          </span>
          <div>
            <div className="text-lg">{effect.category} Effect</div>
            <div className="text-sm text-gray-600 font-normal">{effect.title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {effect.isDetailed ? (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Description</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm">{effect.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Video Script</h4>
              <div className={`${bgColor} p-3 rounded-md`}>
                <p className="text-gray-700 text-sm italic">&ldquo;{effect.videoScript}&rdquo;</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Image Prompt</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-xs font-mono">{effect.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Video Prompt</h4>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-800 text-xs font-mono">{effect.videoGenPrompt}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-8">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${spinnerColor}`}></div>
            <p className="text-gray-600">Loading detailed information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for history origins
function HistoryCard({ origin }: { origin: HistoryOrigin }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {origin.originNumber}
          </span>
          <div>
            <div className="text-lg">{origin.period}</div>
            <div className="text-sm text-gray-600 font-normal">{origin.title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {origin.isDetailed ? (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Description</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm">{origin.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">Video Script</h4>
              <div className="bg-purple-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm italic">&ldquo;{origin.videoScript}&rdquo;</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Image Prompt</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-xs font-mono">{origin.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">Video Prompt</h4>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-800 text-xs font-mono">{origin.videoGenPrompt}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <p className="text-gray-600">Loading detailed information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Video-like presentation component
function VideoPresentation({ items, images, audioData, contentType }: VideoPresentationProps) {
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
  const getItemId = (item: SupplyChainStep | EnvironmentalEffect | HealthEffect | HistoryOrigin): number => {
    if ('stepNumber' in item) return item.stepNumber;
    if ('effectNumber' in item) return item.effectNumber;
    if ('originNumber' in item) return item.originNumber;
    return 0;
  };

  // Helper function to get the stage/category from any item type
  const getItemStage = (item: SupplyChainStep | EnvironmentalEffect | HealthEffect | HistoryOrigin): string => {
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
  const currentImage = images.find(img => img.stepNumber === getItemId(currentStepData));
  const currentAudio = audioData.find((audio: GeneratedAudio) => audio.stepNumber === getItemId(currentStepData));

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
                alt={`Step ${getItemId(currentStepData)}: ${currentStepData.title}`}
                className="w-full h-full object-cover"
                onError={(_e) => {
                  console.error('Video presentation image load error:', currentImage.imageData);
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                  <h3 className="text-white text-lg font-semibold">
                    {contentType === 'supply-chain' ? 'Step' : 'Effect'} {getItemId(currentStepData)}: {getItemStage(currentStepData)}
                  </h3>
                <p className="text-gray-200 text-sm">{currentStepData.title}</p>
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

export default function Home() {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [supplyChain, setSupplyChain] = useState<{ 
    productName: string; 
    supplyChainSteps: SupplyChainStep[];
  } | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<{
    productName: string;
    environmentalEffects: EnvironmentalEffect[];
  } | null>(null);
  const [healthData, setHealthData] = useState<{
    productName: string;
    healthEffects: HealthEffect[];
  } | null>(null);
  const [historyData, setHistoryData] = useState<{
    productName: string;
    historyOrigins: HistoryOrigin[];
  } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateContent = async (type: 'supply-chain' | 'environmental' | 'health' | 'history') => {
    if (!productName.trim()) return;
    
    setIsLoading(true);
    
    // Clear ALL existing data when generating any type
    setSupplyChain(null);
    setEnvironmentalData(null);
    setHealthData(null);
    setHistoryData(null);
    
    // Clear generated images and audio when generating any type
    setGeneratedImages([]);
    setGeneratedAudio([]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, type }),
      });
      
      const data = await response.json();
      
      if (type === 'supply-chain' && data.supplyChain) {
        setSupplyChain(data.supplyChain);
        generateStepDetails(data.supplyChain, 'supply-chain');
      } else if (type === 'environmental' && data.environmental) {
        setEnvironmentalData(data.environmental);
        generateStepDetails(data.environmental, 'environmental');
      } else if (type === 'health' && data.health) {
        setHealthData(data.health);
        generateStepDetails(data.health, 'health');
      } else if (type === 'history' && data.history) {
        setHistoryData(data.history);
        generateStepDetails(data.history, 'history');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStepDetails = async (
    initialData: any,
    type: 'supply-chain' | 'environmental' | 'health' | 'history'
  ) => {
    setIsLoadingDetails(true);
    
    try {
      let items = [];
      if (type === 'supply-chain') {
        items = initialData.supplyChainSteps || [];
      } else if (type === 'environmental') {
        items = initialData.environmentalEffects || [];
      } else if (type === 'health') {
        items = initialData.healthEffects || [];
      } else if (type === 'history') {
        items = initialData.historyOrigins || [];
      }

      const detailPromises = items.map(async (item: any) => {
        try {
          const response = await fetch('/api/generate-step-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              productName: initialData.productName,
              stepNumber: type === 'supply-chain' ? item.stepNumber : 
                          type === 'history' ? item.originNumber : 
                          item.effectNumber,
              stage: type === 'supply-chain' ? item.stage : 
                     type === 'history' ? item.period : 
                     item.category,
              title: item.title,
              type: type
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            return { 
              ...item,
              ...data.stepDetails,
              isDetailed: true 
            };
          } else {
            return { ...item, isDetailed: false };
          }
        } catch (error) {
          console.error(`Error generating details for ${type} item:`, error);
          return { ...item, isDetailed: false };
        }
      });

      const detailedItems = await Promise.all(detailPromises);
      
      // Update the appropriate state
      if (type === 'supply-chain') {
        setSupplyChain({
          ...initialData,
          supplyChainSteps: detailedItems
        });
      } else if (type === 'environmental') {
        setEnvironmentalData({
          ...initialData,
          environmentalEffects: detailedItems
        });
      } else if (type === 'health') {
        setHealthData({
          ...initialData,
          healthEffects: detailedItems
        });
      } else if (type === 'history') {
        setHistoryData({
          ...initialData,
          historyOrigins: detailedItems
        });
      }
    } catch (error) {
      console.error('Error generating step details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const generateImagesAndAudio = async () => {
    if (!supplyChain && !environmentalData && !healthData && !historyData) return;
    
    setIsGeneratingImages(true);
    setIsGeneratingAudio(true);
    
    try {
      const detailedSteps = supplyChain?.supplyChainSteps?.filter(step => step.isDetailed) || [];
      const detailedEnvironmental = environmentalData?.environmentalEffects?.filter(effect => effect.isDetailed) || [];
      const detailedHealth = healthData?.healthEffects?.filter(effect => effect.isDetailed) || [];
      const detailedHistory = historyData?.historyOrigins?.filter(origin => origin.isDetailed) || [];
      
      const allItems = [
        ...detailedSteps.map(step => ({ ...step, type: 'step' })),
        ...detailedEnvironmental.map(effect => ({ ...effect, type: 'environmental', stepNumber: effect.effectNumber })),
        ...detailedHealth.map(effect => ({ ...effect, type: 'health', stepNumber: effect.effectNumber })),
        ...detailedHistory.map(origin => ({ ...origin, type: 'history', stepNumber: origin.originNumber }))
      ];
      
      // Generate images and audio in parallel for each item
      const promises = allItems.map(async (item) => {
        const imagePromise = fetch('/api/generate-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            steps: [item].map(i => ({
              ...i,
              prompt: i.imagePrompt || `Professional ${('stage' in i ? i.stage : 'category' in i ? i.category : 'period' in i ? i.period : 'unknown').toLowerCase()} process for ${supplyChain?.productName || environmentalData?.productName || healthData?.productName || historyData?.productName || 'product'}`
            }))
          }),
        });

        const audioPromise = fetch('/api/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: item.videoScript || `${item.type === 'step' ? 'Step' : item.type === 'environmental' ? 'Environmental Effect' : 'Health Effect'} ${item.stepNumber}: ${item.title}. ${item.description || ''}`
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
            console.error(`Image generation failed for item ${item.stepNumber}`);
          }

          // Process audio response
          let audioResult = null;
          if (audioResponse.ok) {
            const audioData = await audioResponse.json();
            if (audioData.success) {
              audioResult = {
                stepNumber: item.stepNumber,
                success: true,
                audioData: audioData.audioData,
                mimeType: audioData.mimeType,
                generationTime: audioData.generationTime
              };
            } else {
              audioResult = {
                stepNumber: item.stepNumber,
                success: false,
                error: audioData.error || 'Audio generation failed'
              };
            }
          } else {
            console.error(`Audio generation failed for item ${item.stepNumber}`);
            audioResult = {
              stepNumber: item.stepNumber,
              success: false,
              error: 'Audio generation request failed'
            };
          }

          return { image: imageResult, audio: audioResult };
        } catch (error) {
          console.error(`Error generating content for item ${item.stepNumber}:`, error);
          return {
            image: null,
            audio: {
              stepNumber: item.stepNumber,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          };
        }
      });

      // Wait for all generations to complete
      console.log(`Starting parallel generation for ${allItems.length} items (${detailedSteps.length} steps, ${detailedEnvironmental.length} environmental, ${detailedHealth.length} health)...`);
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
            Product Impact Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Discover how products are made, their environmental impact, and health effects with AI-powered insights
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => generateContent('supply-chain')}
                disabled={isLoading || isLoadingDetails || !productName.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Generating...' : isLoadingDetails ? 'Loading Details...' : 'Generate Supply Chain'}
              </Button>
              
              <Button 
                onClick={() => generateContent('environmental')}
                disabled={isLoading || isLoadingDetails || !productName.trim()}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isLoading ? 'Generating...' : isLoadingDetails ? 'Loading Details...' : 'Generate Environmental Effects'}
              </Button>
              
              <Button 
                onClick={() => generateContent('health')}
                disabled={isLoading || isLoadingDetails || !productName.trim()}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isLoading ? 'Generating...' : isLoadingDetails ? 'Loading Details...' : 'Generate Health Effects'}
              </Button>
              
              <Button 
                onClick={() => generateContent('history')}
                disabled={isLoading || isLoadingDetails || !productName.trim()}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isLoading ? 'Generating...' : isLoadingDetails ? 'Loading Details...' : 'Generate History of Origin'}
              </Button>
            </div>
          </CardContent>
        </Card>

                {(supplyChain || environmentalData || healthData || historyData) && (
          <>
            {/* Supply Chain Steps Section */}
            {supplyChain && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Supply Chain Steps</CardTitle>
                  <CardDescription>
                    Core production and manufacturing processes for {supplyChain.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {supplyChain.supplyChainSteps.map((step, index) => (
                      <StepCard 
                        key={`step-${index}`} 
                        step={step} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environmental Effects Section */}
            {environmentalData && environmentalData.environmentalEffects && environmentalData.environmentalEffects.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Environmental Effects</CardTitle>
                  <CardDescription>
                    Environmental impacts from producing {environmentalData.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {environmentalData.environmentalEffects.map((effect, index) => (
                      <EnvironmentalCard 
                        key={`env-${index}`} 
                        effect={effect} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Health Effects Section */}
            {healthData && healthData.healthEffects && healthData.healthEffects.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Health Effects</CardTitle>
                  <CardDescription>
                    Health impacts related to {healthData.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {healthData.healthEffects.map((effect, index) => (
                      <HealthCard 
                        key={`health-${index}`} 
                        effect={effect} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History of Origin Section */}
            {historyData && historyData.historyOrigins && historyData.historyOrigins.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>History of Origin</CardTitle>
                  <CardDescription>
                    Historical development and origins of {historyData.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {historyData.historyOrigins.map((origin, index) => (
                      <HistoryCard 
                        key={`history-${index}`} 
                        origin={origin} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image & Audio Generation Section - Only show after step details are loaded */}
            {((supplyChain?.supplyChainSteps?.some(step => step.isDetailed)) || 
              (environmentalData?.environmentalEffects?.some(effect => effect.isDetailed)) ||
              (healthData?.healthEffects?.some(effect => effect.isDetailed)) ||
              (historyData?.historyOrigins?.some(origin => origin.isDetailed))) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Generate Images & Audio for Each Step
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateImages}
                        disabled={isGeneratingImages || isGeneratingAudio || isLoadingDetails || !(
                          (supplyChain?.supplyChainSteps?.some(step => step.isDetailed)) ||
                          (environmentalData?.environmentalEffects?.some(effect => effect.isDetailed)) ||
                          (healthData?.healthEffects?.some(effect => effect.isDetailed)) ||
                          (historyData?.historyOrigins?.some(origin => origin.isDetailed))
                        )}
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
                          Processing {(supplyChain?.supplyChainSteps?.filter(step => step.isDetailed).length || 0) + 
                            (environmentalData?.environmentalEffects?.filter(e => e.isDetailed).length || 0) + 
                            (healthData?.healthEffects?.filter(h => h.isDetailed).length || 0) + 
                            (historyData?.historyOrigins?.filter(o => o.isDetailed).length || 0)} items simultaneously
                        </div>
                      </div>
                    )}
                    {generatedImages.length > 0 && (
                      <div className="mt-2 text-green-600">
                        Images: {generatedImages.filter(img => img.success).length}/{generatedImages.length} generated successfully
                      </div>
                    )}
                    {generatedAudio.length > 0 && (
                      <div className="mt-1 text-green-600">
                        Audio: {generatedAudio.filter(audio => audio.success).length}/{generatedAudio.length} generated successfully
                      </div>
                    )}
                </CardDescription>
              </CardHeader>
                
                {/* Show content cards as soon as any content is generated */}
                {(generatedImages.length > 0 || generatedAudio.length > 0 || isGeneratingImages || isGeneratingAudio) && (
              <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Supply Chain Steps */}
                      {(supplyChain?.supplyChainSteps || []).filter(step => step.isDetailed).map((step) => {
                        const image = generatedImages.find(img => img.stepNumber === step.stepNumber);
                        const audio = generatedAudio.find(aud => aud.stepNumber === step.stepNumber);
                        
                        return (
                          <Card key={`step-${step.stepNumber}`} className="overflow-hidden">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium">
                                Step {step.stepNumber}: {step.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                                {step.stage}
                          </CardDescription>
                        </CardHeader>
                            
                            <CardContent className="space-y-4">
                              {/* Image Section */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Image</span>
                                  {image?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : image ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingImages ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                              </div>
                                
                                {image?.success && image.imageData ? (
                                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={(() => {
                                        if (typeof image.imageData === 'string') {
                                          return `data:image/jpeg;base64,${image.imageData}`;
                                        } else if (typeof image.imageData === 'object' && image.imageData.image) {
                                          return `data:${image.imageData.mimeType || 'image/jpeg'};base64,${image.imageData.image}`;
                                        }
                                        return '';
                                      })()}
                                      alt={`Generated image for ${step.title}`}
                                      className="w-full h-full object-cover"
                                      onError={(_e) => {
                                        console.error('Image load error for step', step.stepNumber);
                                      }}
                                    />
                                  </div>
                                ) : image?.error ? (
                                  <div className="aspect-video bg-red-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-red-600 text-xs px-2">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{image.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingImages ? (
                                  <div className="aspect-video bg-blue-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                      <div className="text-xs">Creating image...</div>
                              </div>
                            </div>
                          ) : (
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="text-gray-400 text-xs">Click Generate to create image</div>
                            </div>
                          )}
                  </div>
                    
                              {/* Audio Section */}
                      <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Audio</span>
                                  {audio?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : audio ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingAudio ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                      
                                {audio?.success && audio.audioData ? (
                                  <div className="bg-green-50 p-3 rounded-md">
                                    <div className="text-center text-gray-600 text-xs italic">
                                      &ldquo;{step.videoScript}&rdquo;
                                    </div>
                                  </div>
                                ) : audio?.error ? (
                                  <div className="bg-red-50 p-3 rounded-md">
                                    <div className="text-center text-red-600 text-xs">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{audio.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingAudio ? (
                                  <div className="bg-blue-50 p-3 rounded-md">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-pulse text-xs">Creating audio narration...</div>
                      </div>
                    </div>
                                ) : (
                                  <div className="bg-gray-100 p-3 rounded-md">
                                    <div className="text-center text-gray-400 text-xs">Click Generate to create audio</div>
                                  </div>
                                )}
                      </div>
              </CardContent>
            </Card>
                        );
                      })}

                      {/* Environmental Effects */}
                      {(environmentalData?.environmentalEffects || []).filter(effect => effect.isDetailed).map((effect) => {
                        const image = generatedImages.find(img => img.stepNumber === effect.effectNumber);
                        const audio = generatedAudio.find(aud => aud.stepNumber === effect.effectNumber);
                        const isPositive = effect.category.toLowerCase() === 'positive';
                        const borderColor = isPositive ? 'border-green-200' : 'border-orange-200';
                        
                        return (
                          <Card key={`env-${effect.effectNumber}`} className={`overflow-hidden ${borderColor}`}>
                            <CardHeader className="pb-3">
                                                            <CardTitle className="text-sm font-medium">
                                Environmental {effect.effectNumber}: {effect.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {effect.category} Environmental Impact
                              </CardDescription>
                  </CardHeader>
                            
                  <CardContent className="space-y-4">
                              {/* Image Section */}
                    <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Image</span>
                                  {image?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : image ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingImages ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                    </div>
                    
                                {image?.success && image.imageData ? (
                                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={(() => {
                                        if (typeof image.imageData === 'string') {
                                          return `data:image/jpeg;base64,${image.imageData}`;
                                        } else if (typeof image.imageData === 'object' && image.imageData.image) {
                                          return `data:${image.imageData.mimeType || 'image/jpeg'};base64,${image.imageData.image}`;
                                        }
                                        return '';
                                      })()}
                                      alt={`Generated image for ${effect.title}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : image?.error ? (
                                  <div className="aspect-video bg-red-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-red-600 text-xs px-2">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{image.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingImages ? (
                                  <div className="aspect-video bg-blue-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                      <div className="text-xs">Creating image...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="text-gray-400 text-xs">Click Generate to create image</div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Audio Section */}
                      <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Audio</span>
                                  {audio?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : audio ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingAudio ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                      
                                {audio?.success && audio.audioData ? (
                                  <div className="bg-green-50 p-3 rounded-md">
                                    <div className="text-center text-gray-600 text-xs italic">
                                      &ldquo;{effect.videoScript}&rdquo;
                                    </div>
                                  </div>
                                ) : audio?.error ? (
                                  <div className="bg-red-50 p-3 rounded-md">
                                    <div className="text-center text-red-600 text-xs">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{audio.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingAudio ? (
                                  <div className="bg-blue-50 p-3 rounded-md">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-pulse text-xs">Creating audio narration...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 p-3 rounded-md">
                                    <div className="text-center text-gray-400 text-xs">Click Generate to create audio</div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {/* Health Effects */}
                      {(healthData?.healthEffects || []).filter(effect => effect.isDetailed).map((effect) => {
                        const image = generatedImages.find(img => img.stepNumber === effect.effectNumber);
                        const audio = generatedAudio.find(aud => aud.stepNumber === effect.effectNumber);
                        const isPositive = effect.category.toLowerCase() === 'positive';
                        const borderColor = isPositive ? 'border-blue-200' : 'border-red-200';
                        
                        return (
                          <Card key={`health-${effect.effectNumber}`} className={`overflow-hidden ${borderColor}`}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium">
                                Health {effect.effectNumber}: {effect.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {effect.category} Effect
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              {/* Image Section */}
                      <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Image</span>
                                  {image?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : image ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingImages ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                                
                                {image?.success && image.imageData ? (
                                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={(() => {
                                        if (typeof image.imageData === 'string') {
                                          return `data:image/jpeg;base64,${image.imageData}`;
                                        } else if (typeof image.imageData === 'object' && image.imageData.image) {
                                          return `data:${image.imageData.mimeType || 'image/jpeg'};base64,${image.imageData.image}`;
                                        }
                                        return '';
                                      })()}
                                      alt={`Generated image for ${effect.title}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : image?.error ? (
                                  <div className="aspect-video bg-red-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-red-600 text-xs px-2">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{image.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingImages ? (
                                  <div className="aspect-video bg-blue-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                      <div className="text-xs">Creating image...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="text-gray-400 text-xs">Click Generate to create image</div>
                                  </div>
                                )}
                    </div>
                    
                              {/* Audio Section */}
                    <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Audio</span>
                                  {audio?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : audio ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingAudio ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                                
                                {audio?.success && audio.audioData ? (
                                  <div className={`${isPositive ? 'bg-blue-50' : 'bg-red-50'} p-3 rounded-md`}>
                                    <div className="text-center text-gray-600 text-xs italic">
                                      &ldquo;{effect.videoScript}&rdquo;
                                    </div>
                                  </div>
                                ) : audio?.error ? (
                                  <div className="bg-red-50 p-3 rounded-md">
                                    <div className="text-center text-red-600 text-xs">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{audio.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingAudio ? (
                                  <div className="bg-blue-50 p-3 rounded-md">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-pulse text-xs">Creating audio narration...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 p-3 rounded-md">
                                    <div className="text-center text-gray-400 text-xs">Click Generate to create audio</div>
                                  </div>
                                )}
                    </div>
                  </CardContent>
                </Card>
                        );
                      })}

                      {/* History of Origin */}
                      {(historyData?.historyOrigins || []).filter(origin => origin.isDetailed).map((origin) => {
                        const image = generatedImages.find(img => img.stepNumber === origin.originNumber);
                        const audio = generatedAudio.find(aud => aud.stepNumber === origin.originNumber);
                        
                        return (
                          <Card key={`history-${origin.originNumber}`} className="overflow-hidden">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium">
                                History {origin.originNumber}: {origin.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {origin.period}
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              {/* Image Section */}
                      <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Image</span>
                                  {image?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : image ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingImages ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                                
                                {image?.success && image.imageData ? (
                                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={(() => {
                                        if (typeof image.imageData === 'string') {
                                          return `data:image/jpeg;base64,${image.imageData}`;
                                        } else if (typeof image.imageData === 'object' && image.imageData.image) {
                                          return `data:${image.imageData.mimeType || 'image/jpeg'};base64,${image.imageData.image}`;
                                        }
                                        return '';
                                      })()}
                                      alt={`Generated image for ${origin.title}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : image?.error ? (
                                  <div className="aspect-video bg-red-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-red-600 text-xs px-2">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{image.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingImages ? (
                                  <div className="aspect-video bg-blue-50 rounded-md flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                      <div className="text-xs">Creating image...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="text-gray-400 text-xs">Click Generate to create image</div>
                                  </div>
                                )}
                    </div>
                    
                              {/* Audio Section */}
                    <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">Audio</span>
                                  {audio?.success ? (
                                    <span className="text-green-600 text-xs">Ready</span>
                                  ) : audio ? (
                                    <span className="text-red-600 text-xs">Failed</span>
                                  ) : isGeneratingAudio ? (
                                    <span className="text-blue-600 text-xs">Generating...</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Pending</span>
                                  )}
                      </div>
                                
                                {audio?.success && audio.audioData ? (
                                  <div className="bg-green-50 p-3 rounded-md">
                                    <div className="text-center text-gray-600 text-xs italic">
                                      &ldquo;{origin.videoScript}&rdquo;
                                    </div>
                                  </div>
                                ) : audio?.error ? (
                                  <div className="bg-red-50 p-3 rounded-md">
                                    <div className="text-center text-red-600 text-xs">
                                      <div className="font-medium">Generation Failed</div>
                                      <div>{audio.error}</div>
                                    </div>
                                  </div>
                                ) : isGeneratingAudio ? (
                                  <div className="bg-blue-50 p-3 rounded-md">
                                    <div className="text-center text-blue-600">
                                      <div className="animate-pulse text-xs">Creating audio narration...</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 p-3 rounded-md">
                                    <div className="text-center text-gray-400 text-xs">Click Generate to create audio</div>
                                  </div>
                                )}
                    </div>
                  </CardContent>
                </Card>
                        );
                      })}
            </div>
              </CardContent>
                )}
            </Card>
            )}

            {/* Video Presentation Section */}
            {generatedImages.length > 0 && generatedAudio.length > 0 && (supplyChain || environmentalData || healthData || historyData) && (
              <VideoPresentation 
                items={
                  supplyChain?.supplyChainSteps || 
                  environmentalData?.environmentalEffects || 
                  healthData?.healthEffects || 
                  historyData?.historyOrigins || 
                  []
                }
                images={generatedImages} 
                audioData={generatedAudio} 
                                  contentType={
                    supplyChain ? 'supply-chain' : 
                    environmentalData ? 'environmental' : 
                    healthData ? 'health' :
                    'history'
                  }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
