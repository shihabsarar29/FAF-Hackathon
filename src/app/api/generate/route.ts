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

    const prompt = `Generate a quick overview of the 3-4 most critical supply chain steps for: ${productName}

Return ONLY a JSON object with short step titles - no detailed descriptions yet:

{
  "productName": "${productName}",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Raw Material Sourcing",
      "title": "Procure Raw Materials"
    },
    {
      "stepNumber": 2,
      "stage": "Manufacturing",
      "title": "Production Process"
    }
  ]
}

Keep titles short (3-6 words). Focus only on the most essential steps for ${productName}.`;

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
        // Fallback: create basic structure
        supplyChainData = {
          productName: productName,
          supplyChainSteps: [
            {
              stepNumber: 1,
              stage: "Raw Material Sourcing",
              title: "Procure Raw Materials"
            },
            {
              stepNumber: 2,
              stage: "Manufacturing",
              title: "Production Process"
            },
            {
              stepNumber: 3,
              stage: "Distribution",
              title: "Product Distribution"
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
            stage: "Raw Material Sourcing",
            title: "Procure Raw Materials"
          },
          {
            stepNumber: 2,
            stage: "Manufacturing", 
            title: "Production Process"
          },
          {
            stepNumber: 3,
            stage: "Distribution",
            title: "Product Distribution"
          }
        ]
      };
    }

    return NextResponse.json({ supplyChain: supplyChainData });
  } catch (error) {
    console.error('Error generating supply chain overview:', error);
    return NextResponse.json(
      { error: 'Failed to generate supply chain overview' },
      { status: 500 }
    );
  }
} 