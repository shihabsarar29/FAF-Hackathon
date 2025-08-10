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

    const prompt = `Generate a detailed, step-wise supply chain procedure for the product: ${productName}. 

Please provide a comprehensive supply chain that includes:

1. Raw Material Sourcing
2. Manufacturing/Production
3. Quality Control
4. Packaging
5. Distribution
6. Retail/End Consumer

Format the response as a JSON object with the following structure:
{
  "productName": "${productName}",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Raw Material Sourcing",
      "title": "Step title",
      "description": "Detailed description of this step",
      "keyActivities": ["Activity 1", "Activity 2", "Activity 3"],
      "estimatedDuration": "2-3 weeks",
      "keyStakeholders": ["Supplier", "Procurement Team"],
      "videoScript": "Detailed script for video narration of this step"
    }
  ]
}

Make each step detailed and actionable for supply chain professionals. Each step should have enough detail to create a separate video segment.`;

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