import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, stepNumber, stage, title } = await request.json();

    if (!productName || !stepNumber || !stage || !title) {
      return NextResponse.json(
        { error: 'Product name, step number, stage, and title are required' },
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

    const prompt = `Generate focused details for this supply chain step:

Product: ${productName}
Step ${stepNumber}: ${stage} - ${title}

Return ONLY a JSON object with these 4 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of what happens in this step",
  "imagePrompt": "Concise prompt for AI image generation (max 20 words)",
  "videoGenPrompt": "Brief prompt for video generation (max 15 words)"
}

Keep all content concise and focused. Make it specific to ${productName}.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1024,
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
    let stepDetails;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        stepDetails = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Response text:', responseText);
      
      // Fallback for step details
      stepDetails = {
        stepNumber: stepNumber,
        stage: stage,
        title: title,
        description: `This step involves ${stage.toLowerCase()} in the ${productName} production process.`,
        imagePrompt: `${stage} process for ${productName} production`,
        videoGenPrompt: `${productName} ${stage.toLowerCase()} process`
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