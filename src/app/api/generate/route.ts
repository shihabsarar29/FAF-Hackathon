import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, type = 'supply-chain' } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!['supply-chain', 'environmental', 'health', 'history'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be supply-chain, environmental, health, or history' },
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

    let prompt = '';
    let exampleStructure = '';

    if (type === 'supply-chain') {
      exampleStructure = `{
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
}`;

      prompt = `Generate the 5-6 most critical PRODUCTION steps for: ${productName}

Focus ONLY on core manufacturing/production processes. EXCLUDE packaging, distribution, marketing, and sales.

Return ONLY a JSON object for ${productName} following this structure:
${exampleStructure}

Each videoScript should be written in SIMPLE, PLAIN ENGLISH (10-15 words) like you're telling a story to a friend. Use everyday words and add conjunctions like "first", "then", "next", "after that", "now", "finally" to make it feel like a narrative flow.`;

    } else if (type === 'environmental') {
      exampleStructure = `{
  "productName": "Chocolate",
  "environmentalEffects": [
    {
      "effectNumber": 1,
      "category": "Negative",
      "title": "Deforestation Impact",
      "videoScript": "First, growing cocoa often leads to cutting down rainforest trees."
    },
    {
      "effectNumber": 2,
      "category": "Negative", 
      "title": "Water Consumption",
      "videoScript": "Then, processing cocoa beans uses lots of fresh water from local sources."
    },
    {
      "effectNumber": 3,
      "category": "Positive",
      "title": "Sustainable Farming",
      "videoScript": "However, some cocoa farms use sustainable methods that protect the environment."
    },
    {
      "effectNumber": 4,
      "category": "Negative",
      "title": "Carbon Emissions",
      "videoScript": "Finally, chocolate factories release greenhouse gases into the air."
    }
  ]
}`;

      prompt = `Generate 3-4 major ENVIRONMENTAL EFFECTS from producing: ${productName}

Include both POSITIVE and NEGATIVE environmental impacts. Focus on the most significant environmental effects caused by ${productName} production, including:
- Negative impacts: pollution, resource depletion, habitat destruction, emissions, waste
- Positive impacts: sustainable practices, environmental restoration, conservation efforts, renewable energy use

Return ONLY a JSON object for ${productName} following this structure:
${exampleStructure}

Each videoScript should be written in SIMPLE, PLAIN ENGLISH (10-15 words) like you're telling a story to a friend. Use everyday words and add conjunctions like "first", "then", "however", "meanwhile", "finally" to make it feel like a narrative flow.`;

    } else if (type === 'health') {
      exampleStructure = `{
  "productName": "Chocolate",
  "healthEffects": [
    {
      "effectNumber": 1,
      "category": "Positive",
      "title": "Antioxidants",
      "videoScript": "First, dark chocolate gives your body helpful antioxidants that fight disease."
    },
    {
      "effectNumber": 2,
      "category": "Positive",
      "title": "Heart Health",
      "videoScript": "Then, eating small amounts can help keep your heart healthy."
    },
    {
      "effectNumber": 3,
      "category": "Negative",
      "title": "Sugar Content",
      "videoScript": "However, too much chocolate adds lots of sugar to your diet."
    },
    {
      "effectNumber": 4,
      "category": "Negative",
      "title": "Weight Gain",
      "videoScript": "Finally, eating chocolate regularly can lead to weight gain over time."
    }
  ]
}`;

      prompt = `Generate 3-4 key HEALTH EFFECTS related to: ${productName}

Include both positive and negative impacts on human health from production or consumption.

Return ONLY a JSON object for ${productName} following this structure:
${exampleStructure}

Each videoScript should be written in SIMPLE, PLAIN ENGLISH (10-15 words) like you're telling a story to a friend. Use everyday words and add conjunctions like "first", "then", "however", "finally" to make it feel like a narrative flow.`;
    
    } else if (type === 'history') {
      exampleStructure = `{
  "productName": "Chocolate",
  "historyOrigins": [
    {
      "originNumber": 1,
      "period": "Ancient Times",
      "title": "Mayan Discovery",
      "videoScript": "First, ancient Mayans discovered cocoa beans and made bitter drinks from them."
    },
    {
      "originNumber": 2,
      "period": "16th Century",
      "title": "Spanish Colonization",
      "videoScript": "Then, Spanish explorers brought cocoa beans back to Europe from Mexico."
    },
    {
      "originNumber": 3,
      "period": "Industrial Revolution",
      "title": "Mass Production",
      "videoScript": "Next, new machines helped factories make chocolate bars for everyone to buy."
    },
    {
      "originNumber": 4,
      "period": "Modern Era",
      "title": "Global Industry",
      "videoScript": "Finally, chocolate became a worldwide industry worth billions of dollars today."
    }
  ]
}`;

      prompt = `Generate 3-4 key HISTORICAL ORIGINS and development periods for: ${productName}

Focus on the most important historical milestones in the development and spread of ${productName}, including:
- Ancient/early origins and discovery
- Key cultural or geographical developments
- Major technological innovations
- Modern commercialization and global spread

Return ONLY a JSON object for ${productName} following this structure:
${exampleStructure}

Each videoScript should be written in SIMPLE, PLAIN ENGLISH (10-15 words) like you're telling a story to a friend. Use everyday words and add conjunctions like "first", "then", "next", "later", "finally" to make it feel like a historical narrative flow.

Focus on the journey of how ${productName} developed from its origins to what it is today.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Llama 3.3 70B (latest available)
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

    // Return the appropriate data structure based on type
    if (type === 'supply-chain') {
      return NextResponse.json({ supplyChain: supplyChainData });
    } else if (type === 'environmental') {
      return NextResponse.json({ environmental: supplyChainData });
    } else if (type === 'health') {
      return NextResponse.json({ health: supplyChainData });
    } else if (type === 'history') {
      return NextResponse.json({ history: supplyChainData });
    }
  } catch (error) {
    console.error('Error generating supply chain overview:', error);
    return NextResponse.json(
      { error: 'Failed to generate supply chain overview' },
      { status: 500 }
    );
  }
} 