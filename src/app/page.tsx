'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpeech } from 'react-text-to-speech';

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
  imageData: unknown;
  success: boolean;
  error?: string;
  modelUsed?: string;
  isImageGenerated?: boolean;
}

// Component for individual step with text-to-speech
function StepCard({ step }: { step: SupplyChainStep }) {
  const {
    Text,
    speechStatus,
    isInQueue,
    start,
    pause,
    stop,
  } = useSpeech({ 
    text: step.videoScript || `Step ${step.stepNumber}: ${step.title}. ${step.description || ''}`,
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en-US',
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
                    {speechStatus !== "started" ? (
                      <Button 
                        onClick={start} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                        disabled={!step.videoScript}
                      >
                        🔊 Play Audio
                      </Button>
                    ) : (
                      <Button 
                        onClick={pause} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        ⏸️ Pause
                      </Button>
                    )}
                    <Button 
                      onClick={stop} 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      disabled={!isInQueue && speechStatus !== "started"}
                    >
                      ⏹️ Stop
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <Text />
                  {speechStatus === "started" && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                      Playing audio...
                    </div>
                  )}
                  {isInQueue && speechStatus !== "started" && (
                    <div className="mt-2 text-xs text-orange-600">
                      In queue...
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
    speechStatus,
    isInQueue,
    start,
    pause,
    stop,
  } = useSpeech({ 
    text: allScripts,
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en-US',
  });

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
            {speechStatus !== "started" ? (
              <Button 
                onClick={start} 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                🔊 Play All Scripts
              </Button>
            ) : (
              <Button 
                onClick={pause} 
                variant="outline" 
                size="sm"
              >
                ⏸️ Pause All
              </Button>
            )}
            <Button 
              onClick={stop} 
              variant="outline" 
              size="sm"
              disabled={!isInQueue && speechStatus !== "started"}
            >
              ⏹️ Stop All
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Listen to all video scripts narrated in sequence
          {speechStatus === "started" && (
            <div className="mt-2 text-green-600 flex items-center gap-1">
              <div className="animate-pulse w-2 h-2 bg-green-600 rounded-full"></div>
              Playing all scripts...
            </div>
          )}
          {isInQueue && speechStatus !== "started" && (
            <div className="mt-2 text-orange-600">
              Audio in queue...
            </div>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Home() {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [supplyChain, setSupplyChain] = useState<{ productName: string; supplyChainSteps: SupplyChainStep[] } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

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

  const generateImages = async () => {
    if (!supplyChain) return;
    
    setIsGeneratingImages(true);
    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          steps: supplyChain.supplyChainSteps.map(step => ({
            ...step,
            // Use imagePrompt if available, otherwise create a basic prompt
            prompt: step.imagePrompt || `Professional ${step.stage.toLowerCase()} process for ${supplyChain.productName}`
          }))
        }),
      });
      
      const data = await response.json();
      setGeneratedImages(data.images || []);
    } catch (error) {
      console.error('Error generating images:', error);
      setGeneratedImages([]);
    } finally {
      setIsGeneratingImages(false);
    }
  };

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
                                      Generate Images for Each Step
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateImages}
                      disabled={isGeneratingImages || isLoadingDetails || !supplyChain.supplyChainSteps.some(step => step.isDetailed)}
                      variant="default"
                      size="sm"
                    >
                                                                      {isGeneratingImages ? 'Generating Images...' : 'Generate Images'}
                    </Button>
                    {generatedImages && generatedImages.length > 0 && (
                      <Button onClick={downloadImagesData} variant="outline" size="sm">
                        Download Images Data
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Generate professional images for each supply chain step using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingImages && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating images for all steps in parallel...</p>
                  </div>
                )}
                
                {generatedImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedImages.map((image, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Step {image.stepNumber}: {image.stage}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {image.title}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {image.success ? (
                            <div className="space-y-2">
                              <div className="bg-gray-100 p-3 rounded-md min-h-[200px] flex items-center justify-center">
                                {(() => {
                                  const dataObj = (image.imageData && typeof image.imageData === 'object')
                                    ? (image.imageData as { 
                                        description?: string; 
                                        type?: string; 
                                        instructions?: string;
                                        image?: string | null; 
                                        mimeType?: string; 
                                        text?: string 
                                      })
                                    : null;
                                    
                                  // Check for actual image first
                                  const imgSrc = dataObj?.image
                                    ? `data:${dataObj.mimeType || 'image/png'};base64,${dataObj.image}`
                                    : null;
                                  if (imgSrc) {
                                    return (
                                      <img
                                        src={imgSrc}
                                        alt={`Step ${image.stepNumber}: ${image.title}`}
                                        className="w-full h-auto rounded-md"
                                      />
                                    );
                                  }
                                  
                                  // Show description if available (fallback for text-only responses)
                                  if (dataObj?.description) {
                                    return (
                                      <div className="text-gray-700 text-sm space-y-2 w-full">
                                        <div className="font-medium text-orange-600 mb-2 flex items-center gap-2">
                                          <span>⚠️</span>
                                          <span>Image Generation Unavailable</span>
                                        </div>
                                        <p className="leading-relaxed text-left text-xs">
                                          {dataObj.description}
                                        </p>
                                        <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-orange-800">
                                          <strong>💡 Setup Required:</strong> To generate actual images, configure your Google Cloud Project ID and ensure Vertex AI API access.
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  // Fallback to text or default message
                                  const textFallback = typeof image.imageData === 'string'
                                    ? image.imageData
                                    : dataObj?.text || 'Image description generated successfully';
                                    
                                  return (
                                    <p className="text-gray-600 text-sm text-center">
                                      {textFallback}
                                    </p>
                                  );
                                })()}
                              </div>
                              <details className="text-xs">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                  View Original Prompt
                                </summary>
                                <p className="mt-2 text-gray-700 bg-gray-50 p-2 rounded">
                                  {image.imagePrompt}
                                </p>
                              </details>
                              <div className="text-xs text-gray-500 flex justify-between">
                                <span>Model: {image.modelUsed || 'gemini-pro'}</span>
                                <span>{image.isImageGenerated ? '🖼️ Image' : '📝 Description'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-red-50 p-3 rounded-md min-h-[200px] flex items-center justify-center">
                              <p className="text-red-600 text-sm text-center">
                                Failed to generate image
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <PlayAllScripts steps={supplyChain.supplyChainSteps} />

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
