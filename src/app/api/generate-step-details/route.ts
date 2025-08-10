import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { productName, stepNumber, stage, title } = await request.json();

    if (!productName || !stepNumber || !stage || !title) {
      return NextResponse.json(
        { error: 'Product name, step number, stage, and title are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate focused details for this supply chain step:

Product: ${productName}
Step ${stepNumber}: ${stage} - ${title}

Return ONLY a JSON object with these 5 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of what happens in this step",
  "imagePrompt": "Concise prompt for AI image generation (max 20 words)",
  "videoGenPrompt": "Brief prompt for video generation (max 15 words)",
  "videoScript": "ONE SENTENCE narration script for this step (10-15 words max)"
}

Keep all content concise and focused. Make it specific to ${productName}. The videoScript must be ONE sentence only, no more than 15 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Try to extract JSON from the response
    let stepDetails;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        stepDetails = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured data
        stepDetails = {
          stepNumber: stepNumber,
          stage: stage,
          title: title,
          description: `This step handles ${title.toLowerCase()} for ${productName} production.`,
          imagePrompt: `Professional ${stage.toLowerCase()} process for ${productName}`,
          videoGenPrompt: `${stage} workflow for ${productName}`,
          videoScript: `This step focuses on ${title.toLowerCase()} for ${productName}.`
        };
      }
    } catch {
      // If JSON parsing fails, create a structured fallback
      stepDetails = {
        stepNumber: stepNumber,
        stage: stage,
        title: title,
        description: `This step handles ${title.toLowerCase()} for ${productName} production.`,
        imagePrompt: `Professional ${stage.toLowerCase()} process for ${productName}`,
        videoGenPrompt: `${stage} workflow for ${productName}`,
        videoScript: `This step focuses on ${title.toLowerCase()} for ${productName}.`
      };
    }

    return NextResponse.json({ stepDetails });
  } catch (error) {
    console.error('Error generating step details:', error);
    return NextResponse.json(
      { error: 'Failed to generate step details' },
      { status: 500 }
    );
  }
} 