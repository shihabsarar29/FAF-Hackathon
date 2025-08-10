import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate a focused supply chain procedure for the product: ${productName}. 

Focus on only the 3-4 most critical steps that are essential for this product's supply chain. Do not include all 6 stages unless absolutely necessary.

Format the response as a JSON object with the following structure:
{
  "productName": "${productName}",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Critical Stage Name",
      "title": "Essential step title",
      "description": "Concise description of this critical step",
      "keyActivities": ["Key activity 1", "Key activity 2"],
      "estimatedDuration": "Time estimate",
      "keyStakeholders": ["Primary stakeholder"],
      "videoScript": "Brief script for video narration of this step"
    }
  ]
}

Keep each step focused and essential. Only include steps that are truly critical for this specific product's supply chain.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Try to extract JSON from the response
    let supplyChainData;
    try {
      // Look for JSON content in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        supplyChainData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured data from text
        supplyChainData = {
          productName: productName,
          supplyChainSteps: [
            {
              stepNumber: 1,
              stage: "Raw Material Sourcing",
              title: "Material Procurement",
              description: responseText,
              keyActivities: ["Identify suppliers", "Negotiate contracts", "Quality assessment"],
              estimatedDuration: "2-3 weeks",
              keyStakeholders: ["Procurement Team", "Suppliers"],
              videoScript: responseText
            }
          ]
        };
      }
    } catch {
      // If JSON parsing fails, create a structured fallback
      supplyChainData = {
        productName: productName,
        supplyChainSteps: [
          {
            stepNumber: 1,
            stage: "Supply Chain Process",
            title: "Complete Process",
            description: responseText,
            keyActivities: ["Process execution", "Quality control", "Delivery"],
            estimatedDuration: "Varies by product",
            keyStakeholders: ["Supply Chain Team", "Manufacturing", "Logistics"],
            videoScript: responseText
          }
        ]
      };
    }

    return NextResponse.json({ supplyChain: supplyChainData });
  } catch (error) {
    console.error('Error generating supply chain:', error);
    return NextResponse.json(
      { error: 'Failed to generate supply chain' },
      { status: 500 }
    );
  }
} 