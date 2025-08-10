import { NextRequest, NextResponse } from 'next/server';

// Helper function to chunk text if it's too long
function chunkText(text: string, maxLength: number = 500): string[] {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
        currentChunk = trimmedSentence;
      } else {
        // If single sentence is too long, just add it as is
        chunks.push(trimmedSentence + '.');
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + '.');
  }
  
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Generative AI API key not configured' },
        { status: 500 }
      );
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

    // Limit text length to improve generation time
    const maxTextLength = 800; // Reasonable limit for TTS
    let processedText = text;
    
    if (text.length > maxTextLength) {
      console.log(`Text too long (${text.length} chars), truncating to ${maxTextLength} chars`);
      processedText = text.substring(0, maxTextLength).trim();
      // Try to end at a sentence boundary
      const lastPeriod = processedText.lastIndexOf('.');
      const lastExclamation = processedText.lastIndexOf('!');
      const lastQuestion = processedText.lastIndexOf('?');
      const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
      
      if (lastSentenceEnd > maxTextLength * 0.8) {
        processedText = processedText.substring(0, lastSentenceEnd + 1);
      }
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: processedText
        }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore"
            }
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    console.log(`Generating audio for ${processedText.length} characters: "${processedText.substring(0, 100)}..."`);
    const startTime = Date.now();

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini TTS API error: ${response.status} - ${errorText}`);
        return NextResponse.json(
          { error: `Gemini TTS API error: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const generationTime = (Date.now() - startTime) / 1000;
      console.log(`Audio generation completed in ${generationTime.toFixed(2)}s`);
      
      // Extract audio data from response
      if (data.candidates && 
          data.candidates.length > 0 && 
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0 &&
          data.candidates[0].content.parts[0].inlineData) {
        
        const audioData = data.candidates[0].content.parts[0].inlineData.data;
        const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType;
        
        console.log(`Audio generated successfully - mime type: ${mimeType}, size: ${audioData.length} chars`);
        
        return NextResponse.json({
          success: true,
          audioData: audioData,
          mimeType: mimeType || 'audio/pcm',
          format: 'base64',
          generationTime: generationTime,
          textLength: processedText.length,
          originalTextLength: text.length
        });
      } else {
        console.error('No audio data found in response:', JSON.stringify(data, null, 2));
        return NextResponse.json(
          { error: 'No audio data received from Gemini TTS API' },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Audio generation timeout');
        return NextResponse.json(
          { error: 'Audio generation timed out - text may be too long' },
          { status: 408 }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
} 