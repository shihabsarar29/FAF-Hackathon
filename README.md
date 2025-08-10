# Supply Chain Generator

A Next.js web application that generates step-wise supply chain procedures for any product using Google's Gemini AI, with structured JSON output for video generation and **parallel AI image generation** for each step.

## Features

- Clean, modern UI built with Tailwind CSS and shadcn/ui
- AI-powered supply chain generation using Gemini Pro
- **Structured JSON output** with detailed step-by-step information
- **Video-ready content** with scripts, activities, and stakeholder information
- **🆕 Parallel AI Image Generation** for each supply chain step
- **Download capabilities** for JSON data, video scripts, and image data
- Responsive design that works on all devices
- Step-by-step supply chain procedures including:
  - Raw Material Sourcing
  - Manufacturing/Production
  - Quality Control
  - Packaging
  - Distribution
  - Retail/End Consumer

## Video Generation Features

Each supply chain step includes:
- **Step Number & Stage**: Clear identification of each phase
- **Title & Description**: Detailed explanation of the process
- **Key Activities**: Specific tasks and actions required
- **Estimated Duration**: Time estimates for planning
- **Key Stakeholders**: People and teams involved
- **Video Script**: Ready-to-use narration script for video creation

## 🆕 AI Image Generation Features

- **Parallel Processing**: Generate images for all steps simultaneously
- **Professional Quality**: Business/industrial style images suitable for presentations
- **Context-Aware**: Each image is generated based on the specific step content
- **Structured Output**: Complete image data with prompts and metadata
- **Download Ready**: Export image data for use in video editing tools

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key (Gemini)

## Setup

1. **Clone and install dependencies:**
   ```bash
   cd supply-chain-generator
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Google AI API key:
     ```
     GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
     ```

3. **Get a Google AI API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env.local` file

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Generate Supply Chain**: Enter a product name and generate the supply chain procedure
2. **Generate Images**: Click "Generate Images" to create AI-generated images for all steps in parallel
3. **Download Content**: Export JSON data, video scripts, and image data for further processing
4. **View Results**: See structured output with separate sections for each step and generated images

## Output Format

### Supply Chain Data
```json
{
  "productName": "Product Name",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Stage Name",
      "title": "Step Title",
      "description": "Detailed description",
      "keyActivities": ["Activity 1", "Activity 2"],
      "estimatedDuration": "Time estimate",
      "keyStakeholders": ["Stakeholder 1", "Stakeholder 2"],
      "videoScript": "Ready-to-use video narration script"
    }
  ]
}
```

### Generated Images Data
```json
{
  "images": [
    {
      "stepNumber": 1,
      "stage": "Stage Name",
      "title": "Step Title",
      "imagePrompt": "AI prompt used for generation",
      "imageData": "Generated image data",
      "success": true
    }
  ],
  "totalSteps": 6,
  "successfulGenerations": 6
}
```

## Download Options

- **JSON Data**: Complete structured data for API integration
- **Video Scripts**: Formatted text files with all video narration content
- **🆕 Images Data**: Complete image generation data with prompts and metadata

## Technology Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI:** Google Gemini Pro via @google/generative-ai
- **🆕 Image Generation:** Gemini 2.0 Flash Exp for parallel image creation
- **Deployment:** Ready for Vercel, Netlify, or any Next.js hosting platform

## Project Structure

```
supply-chain-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts          # Supply chain generation API
│   │   │   └── generate-images/
│   │   │       └── route.ts          # 🆕 Parallel image generation API
│   │   ├── globals.css               # Global styles
│   │   └── page.tsx                  # Main page with image generation
│   └── components/
│       └── ui/                       # shadcn/ui components
├── .env.local                        # Environment variables
├── sample-output.json                # Example supply chain output
├── 🆕 sample-images-output.json      # Example images output
└── README.md                         # This file
```

## Customization

- Modify the prompts in both API routes to change AI behavior
- Update the UI components in `src/app/page.tsx`
- Customize the JSON structure for different video generation tools
- Adjust image generation requirements in the image API
- Modify the styling in `src/app/globals.css`

## Video Generation Integration

The structured output is designed to work with:
- Video editing software (Adobe Premiere, Final Cut Pro)
- AI video generation tools (Runway, Pika Labs, Sora)
- Automated video creation platforms
- Content management systems
- **🆕 Image-to-video tools** using the generated AI images

## 🆕 Image Generation Workflow

1. **Supply Chain Generation**: Create the structured supply chain procedure
2. **Parallel Image Creation**: Generate professional images for all steps simultaneously
3. **Content Assembly**: Combine supply chain data with generated images
4. **Export & Integration**: Download all data for use in video creation tools

## Deployment

The app is ready to deploy on:
- Vercel (recommended for Next.js)
- Netlify
- Any platform that supports Next.js

Make sure to set the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your deployment platform.

## License

MIT
