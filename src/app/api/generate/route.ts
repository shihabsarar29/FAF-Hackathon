import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate a detailed overview of the 5-6 most critical PRODUCTION steps for: ${productName}

Focus ONLY on core manufacturing/production processes. EXCLUDE packaging, distribution, marketing, and sales.

Example for Chocolate:
{
  "productName": "Chocolate",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Harvesting",
      "title": "Cocoa Bean Harvesting",
      "videoScript": "First, workers pick ripe cocoa pods from trees by hand."
    },
    {
      "stepNumber": 2,
      "stage": "Fermentation & Drying",
      "title": "Bean Processing",
      "videoScript": "Then, the beans sit in boxes for a few days to ferment and develop flavor."
    },
    {
      "stepNumber": 3,
      "stage": "Roasting",
      "title": "Bean Roasting",
      "videoScript": "Next, the beans go into big ovens and get roasted until they smell good."
    },
    {
      "stepNumber": 4,
      "stage": "Grinding",
      "title": "Cocoa Mass Creation",
      "videoScript": "After that, machines grind the roasted beans into a thick paste."
    },
    {
      "stepNumber": 5,
      "stage": "Mixing & Conching",
      "title": "Chocolate Mixing",
      "videoScript": "Now, sugar and milk get mixed with the paste to make smooth chocolate."
    },
    {
      "stepNumber": 6,
      "stage": "Molding & Cooling",
      "title": "Final Shaping",
      "videoScript": "Finally, the hot chocolate gets poured into molds and cooled down."
    }
  ]
}

Return ONLY a JSON object for ${productName} following this structure. Each videoScript should be written in SIMPLE, PLAIN ENGLISH (10-15 words) like you're telling a story to a friend. Use everyday words and add conjunctions like "first", "then", "next", "after that", "now", "finally" to make it feel like a narrative flow. Just describe what actually happens in simple terms but connect the steps together.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Llama 3.3 70B (latest available)
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from Groq API' },
        { status: 500 }
      );
    }
    
    // Try to extract JSON from the response
    let supplyChainData;
    try {
      // Look for JSON content in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        supplyChainData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Response text:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
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