import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const endpoint = 'https://api.openai.com/v1/audio/speech';

    const requestBody = {
      model: 'tts-1', // or 'tts-1-hd' for higher quality
      input: text,
      voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
      response_format: 'mp3'
    };

    console.log(`Generating OpenAI TTS for ${text.length} characters: "${text.substring(0, 100)}..."`);
    const startTime = Date.now();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI TTS API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `OpenAI TTS API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the audio data as array buffer
    const audioBuffer = await response.arrayBuffer();
    const generationTime = (Date.now() - startTime) / 1000;
    console.log(`OpenAI TTS generation completed in ${generationTime.toFixed(2)}s`);
    
    // Convert to base64 for frontend consumption
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    console.log(`Audio generated successfully - format: mp3, size: ${base64Audio.length} chars`);
    
    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      mimeType: 'audio/mpeg',
      format: 'base64',
      generationTime: generationTime,
      textLength: text.length
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
} 