# Setup Guide for Supply Chain Generator

## Environment Variables

Create a `.env.local` file in the root directory with the following variable:

```env
# Required for both text generation (supply chain steps) AND image generation
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

## Getting Your API Key

### Google Generative AI API Key (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env.local` file

That's it! The same API key is used for both:
- **Text Generation**: Supply chain step generation using Gemini models
- **Image Generation**: Professional images using Imagen 4.0 model

## Features

- ✅ **Supply Chain Generation**: Creates focused 3-4 step supply chains for any product
- ✅ **Image Generation**: Generates professional business images for each supply chain step
- ✅ **Modern UI**: Clean, responsive interface with real-time generation
- ✅ **Export Options**: Download supply chain data and images

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your `.env.local` file with the API key

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a product name** (e.g., "Smartphone", "Coffee", "T-shirt")
2. **Click "Generate Supply Chain"** to create the supply chain steps
3. **Click "Generate Images"** to create professional images for each step
4. **Download** the data in JSON format if needed

## Troubleshooting

- **400 Error**: Make sure you've entered a product name before generating
- **500 Error**: Check that your `GOOGLE_GENERATIVE_AI_API_KEY` is correctly set in `.env.local`
- **Image Generation Issues**: Ensure your API key has access to the Imagen models

For any other issues, check the browser console and server logs for detailed error messages. 