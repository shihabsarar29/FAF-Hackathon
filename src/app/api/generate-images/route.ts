import { NextRequest, NextResponse } from 'next/server';

// Helper types for type safety
interface SupplyChainStep {
  stepNumber: number;
  stage: string;
  title: string;
  description?: string;
  imagePrompt?: string;
  videoGenPrompt?: string;
  videoScript?: string;
  prompt?: string; // Added by frontend for image generation
  isDetailed?: boolean;
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

async function generateImageWithGemini(prompt: string): Promise<{ success: boolean; imageData?: string; error?: string }> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Generative AI API key not configured');
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict';
    
    const requestBody = {
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: 1
      }
    };

    const response = await retryWithBackoff(async () => {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!result.ok) {
        const errorText = await result.text();
        console.error(`Imagen API error: ${result.status} - ${errorText}`);
        throw new Error(`Imagen API error: ${result.status} - ${errorText}`);
      }

      return result.json();
    });

    // Extract image from Imagen API response
    if (response.predictions && 
        response.predictions.length > 0 && 
        response.predictions[0].bytesBase64Encoded) {
      
      return {
        success: true,
        imageData: response.predictions[0].bytesBase64Encoded
      };
    }
    
    return {
      success: false,
      error: 'No image generated from Imagen API'
    };
  } catch (error) {
    console.error('Error calling Imagen API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('Received request body:', JSON.stringify(requestBody, null, 2));
    
    const { steps, supplyChain } = requestBody;

    // Accept either 'steps' or 'supplyChain.supplyChainSteps' format
    const supplyChainSteps = steps || supplyChain?.supplyChainSteps;
    
    if (!supplyChainSteps || !Array.isArray(supplyChainSteps)) {
      return NextResponse.json(
        { error: 'Supply chain steps data is required' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Generative AI API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const imageResults = await Promise.all(
      supplyChainSteps.map(async (step: SupplyChainStep) => {
        try {
          // Use imagePrompt from step if available, otherwise create a focused prompt
          const prompt = step.imagePrompt || step.prompt || `A professional business photograph showing ${step.stage.toLowerCase()}: ${step.title}. 
${step.description || ''}. 
Style: clean, modern, professional business photography, good lighting, high quality, industrial setting, business context, photorealistic.`;

          console.log(`Generating image for step ${step.stepNumber}: ${step.stage}`);
          
          const imageResult = await generateImageWithGemini(prompt);

          if (imageResult.success && imageResult.imageData) {
            return {
              stepNumber: step.stepNumber,
              stage: step.stage,
              title: step.title,
              imagePrompt: prompt,
              imageData: {
                image: imageResult.imageData,
                mimeType: 'image/png',
                type: 'base64_image'
              },
              success: true,
              modelUsed: 'imagen-4.0-generate-preview-06-06',
              isImageGenerated: true
            };
          } else {
            return {
              stepNumber: step.stepNumber,
              stage: step.stage,
              title: step.title,
              imagePrompt: prompt,
              error: imageResult.error || 'Failed to generate image',
              success: false,
              modelUsed: 'imagen-4.0-generate-preview-06-06',
              isImageGenerated: false
            };
          }
        } catch (error) {
          console.error(`Error generating image for step ${step.stepNumber}:`, error);
          
          return {
            stepNumber: step.stepNumber,
            stage: step.stage,
            title: step.title,
            error: error instanceof Error ? error.message : 'Failed to generate image',
            success: false,
            modelUsed: 'imagen-4.0-generate-preview-06-06',
            isImageGenerated: false
          };
        }
      })
    );

    const successCount = imageResults.filter(r => r.success).length;
    const totalCount = imageResults.length;

    return NextResponse.json({ 
      images: imageResults,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      },
      message: `Generated ${successCount} out of ${totalCount} images successfully.`
    });
  } catch (error) {
    console.error('Error in image generation route:', error);
    return NextResponse.json(
      { error: 'Failed to process image generation request' },
      { status: 500 }
    );
  }
} 