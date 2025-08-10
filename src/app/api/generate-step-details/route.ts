import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, stepNumber, stage, title, type = 'supply-chain' } = await request.json();

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

    let prompt = '';
    let exampleImagePrompt = '';
    let exampleVideoPrompt = '';

    if (type === 'environmental') {
      const isPositiveEnvironmental = stage.toLowerCase() === 'positive';
      
      if (isPositiveEnvironmental) {
        exampleImagePrompt = "Professional environmental photography of sustainable farming, green renewable energy systems, conservation efforts, natural landscape restoration, bright natural lighting --ar 16:9 --style raw";
        exampleVideoPrompt = "Sustainable environmental practices demonstration";
      } else {
        exampleImagePrompt = "Professional environmental photography of deforestation impact, cleared forest land with logging equipment, aerial drone shot, documentary style, natural lighting --ar 16:9 --style raw";
        exampleVideoPrompt = "Environmental impact documentation showing habitat destruction";
      }
      
      prompt = `Generate focused details for this environmental effect:

Product: ${productName}
Effect ${stepNumber}: ${stage} Environmental Impact - ${title}

Return ONLY a JSON object with these 4 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of this environmental impact (${stage.toLowerCase()})",
  "imagePrompt": "Environmental photography-style prompt with detailed visual description, documentary style, environmental ${stage.toLowerCase()} impact focus (max 30 words)",
  "videoGenPrompt": "Brief prompt for environmental impact video generation (max 15 words)"
}

For the imagePrompt, create an environmental photography-style prompt that includes:
${isPositiveEnvironmental ? 
  `- Positive environmental documentation of ${productName} sustainable practices
- Environmental restoration photography: "sustainable agriculture", "renewable energy", "conservation photography", "restoration projects"
- Positive natural settings: "thriving ecosystems", "clean energy facilities", "restored habitats", "sustainable farms"
- Professional environmental documentation: "nature photography", "conservation photography", "sustainable development photography"
- Environmental restoration parameters: "--ar 16:9", "--style raw", "environmental success story", "conservation achievement"` :
  `- Documentary photography of environmental impact from ${productName} production
- Environmental/nature photography style: "environmental photography", "documentary photography", "aerial photography"
- Natural settings: "forest clearing", "polluted water", "factory emissions", "waste sites"
- Professional documentation: "DSLR camera", "drone photography", "wide landscape shot"
- Environmental parameters: "--ar 16:9", "--style raw", "photojournalistic", "environmental impact"`
}

Example format: "${exampleImagePrompt}"

Keep all content focused on the ${stage.toLowerCase()} environmental impact of ${productName} production.`;

    } else if (type === 'health') {
      exampleImagePrompt = "Professional medical photography of healthy food, fresh antioxidant-rich ingredients, clean studio lighting, macro lens close-up, health magazine style --ar 16:9 --style raw";
      exampleVideoPrompt = "Health benefits demonstration showing nutritional value";
      
      prompt = `Generate focused details for this health effect:

Product: ${productName}
Effect ${stepNumber}: ${stage} - ${title}

Return ONLY a JSON object with these 4 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of this health effect",
  "imagePrompt": "Health/medical photography-style prompt with detailed visual description, clinical or lifestyle focus (max 30 words)",
  "videoGenPrompt": "Brief prompt for health impact video generation (max 15 words)"
}

For the imagePrompt, create a health/medical photography-style prompt that includes:
- Medical or lifestyle photography showing health impact of ${productName}
- Health photography style: "medical photography", "lifestyle photography", "clinical photography", "health magazine style"
- Health-related visuals: "healthy lifestyle", "medical consultation", "nutritional benefits", "wellness concept"
- Professional medical/lifestyle photography: "studio lighting", "macro lens", "clean background"
- Health parameters: "--ar 16:9", "--style raw", "professional health imagery", "medical documentation"

Example format: "${exampleImagePrompt}"

Keep all content focused on the health impact of ${productName}.`;

    } else if (type === 'history') {
      exampleImagePrompt = "Professional historical photography of ancient chocolate making, traditional Mayan civilization, historical artifacts, sepia tone documentary style, museum quality lighting --ar 16:9 --style raw";
      exampleVideoPrompt = "Historical documentation of product origins";
      
      prompt = `Generate focused details for this historical period:

Product: ${productName}
Period ${stepNumber}: ${stage} - ${title}

Return ONLY a JSON object with these 4 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of this historical period and its significance",
  "imagePrompt": "Historical photography-style prompt with detailed visual description, documentary style, period-appropriate imagery (max 30 words)",
  "videoGenPrompt": "Brief prompt for historical documentation video generation (max 15 words)"
}

For the imagePrompt, create a historical photography-style prompt that includes:
- Historical documentation of ${productName} during the ${stage} period
- Historical photography style: "historical photography", "documentary photography", "period photography", "archival photography"
- Period-appropriate settings: "ancient civilizations", "historical artifacts", "traditional methods", "cultural heritage"
- Professional historical documentation: "museum photography", "archaeological photography", "heritage documentation"
- Historical parameters: "--ar 16:9", "--style raw", "historical accuracy", "documentary realism"

Example format: "${exampleImagePrompt}"

Keep all content focused on the historical development of ${productName} during the ${stage} period.`;

    } else {
      // Default supply chain prompt
      exampleImagePrompt = "Professional industrial photography of chocolate tempering machines, workers in white coats, natural lighting through factory windows, DSLR camera wide shot, photorealistic --ar 16:9 --style raw";
      exampleVideoPrompt = "Industrial process demonstration";
      console.log('Using example video prompt:', exampleVideoPrompt);
      
      prompt = `Generate focused details for this supply chain step:

Product: ${productName}
Step ${stepNumber}: ${stage} - ${title}

Return ONLY a JSON object with these 4 fields:

{
  "stepNumber": ${stepNumber},
  "stage": "${stage}",
  "title": "${title}",
  "description": "Short 1-2 sentence description of what happens in this step",
  "imagePrompt": "Professional photography-style prompt with detailed visual description, lighting, camera angle, style parameters (max 30 words)",
  "videoGenPrompt": "Brief prompt for video generation (max 15 words)"
}

For the imagePrompt, create a professional photography-style prompt that includes:
- Realistic photographic description of the ${stage} process for ${productName}
- Photography style keywords: "professional photography", "industrial photography", "documentary photography", "commercial photography"
- Photographic lighting: "natural lighting", "soft lighting", "dramatic lighting", "studio lighting"
- Camera specifications: "DSLR camera", "wide angle lens", "macro lens", "telephoto lens"
- Shot composition: "wide shot", "close-up", "medium shot", "overhead view"
- Photography parameters: "--ar 16:9", "--style raw", "high resolution", "photorealistic"

Example format: "${exampleImagePrompt}"

Keep all content concise and focused. Make it specific to ${productName}.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
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
      if (type === 'environmental') {
        const isPositiveEnvironmental = stage.toLowerCase() === 'positive';
        
        stepDetails = {
          stepNumber: stepNumber,
          stage: stage,
          title: title,
          description: `This environmental effect involves ${stage.toLowerCase()} impact from ${productName} production.`,
          imagePrompt: isPositiveEnvironmental 
            ? `Environmental conservation photography of ${productName} sustainable practices, renewable energy systems, natural restoration, bright daylight --ar 16:9 --style raw`
            : `Environmental documentary photography of ${productName} ${title.toLowerCase()} impact, aerial view, natural landscape, photojournalistic style --ar 16:9 --style raw`,
          videoGenPrompt: isPositiveEnvironmental
            ? `${productName} sustainable environmental practices`
            : `${productName} environmental impact ${title.toLowerCase()}`
        };
      } else if (type === 'health') {
        stepDetails = {
          stepNumber: stepNumber,
          stage: stage,
          title: title,
          description: `This health effect involves ${stage.toLowerCase()} impact related to ${productName}.`,
          imagePrompt: `Professional health photography of ${productName} ${stage.toLowerCase()} effect, medical consultation setting, clean studio lighting --ar 16:9 --style raw`,
          videoGenPrompt: `${productName} health impact ${stage.toLowerCase()}`
        };
      } else if (type === 'history') {
        stepDetails = {
          stepNumber: stepNumber,
          stage: stage,
          title: title,
          description: `This historical period involves ${stage.toLowerCase()} development of ${productName}.`,
          imagePrompt: `Historical photography of ${productName} during the ${stage} period, showcasing ancient methods, artifacts, and cultural heritage --ar 16:9 --style raw`,
          videoGenPrompt: `Historical documentation of ${productName} during the ${stage} period`
        };
      } else {
        stepDetails = {
          stepNumber: stepNumber,
          stage: stage,
          title: title,
          description: `This step involves ${stage.toLowerCase()} in the ${productName} production process.`,
          imagePrompt: `Professional industrial photography of ${productName} ${stage.toLowerCase()} process, workers in action, natural lighting through factory windows, DSLR camera wide shot, photorealistic --ar 16:9 --style raw`,
          videoGenPrompt: `${productName} ${stage.toLowerCase()} process`
        };
      }
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