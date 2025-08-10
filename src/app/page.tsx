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
  steps: SupplyChainStep[];
  images: GeneratedImage[];
  audioData: GeneratedAudio[];
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
              <h4 className="text-sm font-medium mb-2 text-gray-600">📝 Description</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-600">🎬 Video Script</h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-gray-700 text-sm italic">&ldquo;{step.videoScript}&rdquo;</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">🖼️ Image Prompt</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-800 text-xs font-mono">{step.imagePrompt}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">🎥 Video Prompt</h4>
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

// Video-like presentation component
function VideoPresentation({ steps, images, audioData }: VideoPresentationProps) {
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

  // Get steps that have both images and audio
  const presentationSteps = steps.filter(step => {
    const hasImage = images.some(img => img.stepNumber === step.stepNumber && img.success);
    const hasAudio = audioData.some((audio: GeneratedAudio) => audio.stepNumber === step.stepNumber && audio.success);
    return step.isDetailed && step.videoScript && hasImage && hasAudio;
  });

  // Calculate step start times and total duration based on actual or estimated durations
  const { stepStartTimes, totalTime } = React.useMemo(() => {
    const times: number[] = [0];
    let cumulativeTime = 0;
    
    presentationSteps.forEach((step, index) => {
      // Use actual duration if available, otherwise estimate 5 seconds
      const stepDuration = stepDurations[step.stepNumber] || 5;
      cumulativeTime += stepDuration;
      if (index < presentationSteps.length - 1) {
        times.push(cumulativeTime);
      }
    });
    
    return { stepStartTimes: times, totalTime: cumulativeTime };
  }, [presentationSteps, stepDurations]);

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

  const currentStepData = presentationSteps[currentStep];
  const currentImage = images.find(img => img.stepNumber === currentStepData?.stepNumber);
  const currentAudio = audioData.find((audio: GeneratedAudio) => audio.stepNumber === currentStepData?.stepNumber);

  // Function to play pre-generated audio
  const playCurrentStepAudio = React.useCallback(async () => {
    if (!currentAudio || !currentAudio.success || !currentAudio.audioData) {
      console.error('No audio data available for current step:', currentStepData?.stepNumber);
      setAudioStatus('error');
      setAudioError('No audio data available');
      return;
    }

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

      // Create audio blob (OpenAI returns MP3 format)
      const blob = new Blob([bytes], { type: currentAudio.mimeType || 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

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
          
          // Update absolute time within current step only, but ensure it never goes backward
          const stepStartTime = stepStartTimes[currentStep] || 0;
          const absoluteTime = stepStartTime + audio.currentTime;
          
          // Only update if the new time is greater than current time (prevents backward jumps)
          setAbsoluteCurrentTime(prevTime => Math.max(prevTime, absoluteTime));
          
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
        
        // Store actual duration for this step
        if (audio.duration > 0 && currentStepData) {
          setStepDurations(prev => ({
            ...prev,
            [currentStepData.stepNumber]: audio.duration
          }));
        }
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
  }, [currentAudio, currentStepData, stepStartTimes]);

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
            return { 
              ...step, // Preserve original data including videoScript from overview
              ...data.stepDetails, // Add detailed information
              isDetailed: true 
            };
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
            {/* Step Details Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {supplyChain.supplyChainSteps.map((step, index) => (
                <StepCard 
                  key={`step-${index}`} 
                  step={step} 
                />
              ))}
            </div>

            {/* Image & Audio Generation Section - Only show after step details are loaded */}
            {supplyChain.supplyChainSteps.some(step => step.isDetailed) && (
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
                
                {/* Show content cards as soon as any content is generated */}
                {(generatedImages.length > 0 || generatedAudio.length > 0 || isGeneratingImages || isGeneratingAudio) && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {supplyChain.supplyChainSteps.filter(step => step.isDetailed).map((step) => {
                        const image = generatedImages.find(img => img.stepNumber === step.stepNumber);
                        const audio = generatedAudio.find(aud => aud.stepNumber === step.stepNumber);
                        
                        return (
                          <Card key={step.stepNumber} className="overflow-hidden">
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
                                  <span className="text-xs font-medium text-gray-600">🖼️ Image</span>
                                  {image?.success ? (
                                    <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">✅</span>
                                  ) : image ? (
                                    <span className="text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full">❌</span>
                                  ) : isGeneratingImages ? (
                                    <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <div className="animate-spin w-2 h-2 border border-blue-600 border-t-transparent rounded-full"></div>
                                      Generating...
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs bg-gray-50 px-2 py-0.5 rounded-full">⏳</span>
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
                                  <span className="text-xs font-medium text-gray-600">🔊 Audio</span>
                                  {audio?.success ? (
                                    <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">✅</span>
                                  ) : audio ? (
                                    <span className="text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full">❌</span>
                                  ) : isGeneratingAudio ? (
                                    <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <div className="animate-spin w-2 h-2 border border-blue-600 border-t-transparent rounded-full"></div>
                                      Generating...
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs bg-gray-50 px-2 py-0.5 rounded-full">⏳</span>
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
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Video Presentation Section */}
            {generatedImages.length > 0 && generatedAudio.length > 0 && (
              <VideoPresentation 
                steps={supplyChain.supplyChainSteps} 
                images={generatedImages} 
                audioData={generatedAudio} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
