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

    const prompt = `Generate detailed information for this supply chain step:

Product: ${productName}
Step ${stepNumber}: ${stage} - ${title}

Return a JSON object with detailed information:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Detailed description of this step (2-3 sentences)",
  "keyActivities": ["Activity 1", "Activity 2", "Activity 3"],
  "estimatedDuration": "Time estimate",
  "keyStakeholders": ["Stakeholder 1", "Stakeholder 2"],
  "videoScript": "Detailed script for video narration of this step (3-4 sentences)"
}

Make it specific to ${productName} and focus on practical, actionable details.`;

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
          description: `This step involves ${title.toLowerCase()} for ${productName} production, ensuring quality and efficiency throughout the process.`,
          keyActivities: ["Process execution", "Quality control", "Documentation"],
          estimatedDuration: "1-2 weeks",
          keyStakeholders: ["Supply Chain Team", "Quality Assurance"],
          videoScript: `In this critical step of ${productName} production, we focus on ${title.toLowerCase()}. This process ensures that quality standards are met and the supply chain operates efficiently.`
        };
      }
    } catch {
      // If JSON parsing fails, create a structured fallback
      stepDetails = {
        stepNumber: stepNumber,
        stage: stage,
        title: title,
        description: `This step involves ${title.toLowerCase()} for ${productName} production, ensuring quality and efficiency throughout the process.`,
        keyActivities: ["Process execution", "Quality control", "Documentation"],
        estimatedDuration: "1-2 weeks",
        keyStakeholders: ["Supply Chain Team", "Quality Assurance"],
        videoScript: `In this critical step of ${productName} production, we focus on ${title.toLowerCase()}. This process ensures that quality standards are met and the supply chain operates efficiently.`
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