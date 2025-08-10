# Supply Chain Generator

A Next.js web application that generates step-wise supply chain procedures for any product using Google's Gemini AI, with structured JSON output for video generation.

## Features

- Clean, modern UI built with Tailwind CSS and shadcn/ui
- AI-powered supply chain generation using Gemini Pro
- **Structured JSON output** with detailed step-by-step information
- **Video-ready content** with scripts, activities, and stakeholder information
- **Download capabilities** for JSON data and video scripts
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

1. Enter a product name in the input field (e.g., "Smartphone", "Coffee", "T-shirt")
2. Click "Generate Supply Chain"
3. Wait for the AI to generate a comprehensive supply chain procedure
4. View the structured output with separate sections for each step
5. Download the JSON data or video scripts for further processing

## Output Format

The application generates structured JSON data with the following structure:

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

## Download Options

- **JSON Data**: Complete structured data for API integration
- **Video Scripts**: Formatted text files with all video narration content

## Technology Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI:** Google Gemini Pro via @google/generative-ai
- **Deployment:** Ready for Vercel, Netlify, or any Next.js hosting platform

## Project Structure

```
supply-chain-generator/
├── src/
│   ├── app/
│   │   ├── api/generate/
│   │   │   └── route.ts          # Gemini API endpoint with JSON output
│   │   ├── globals.css           # Global styles
│   │   └── page.tsx              # Main page with structured display
│   └── components/
│       └── ui/                   # shadcn/ui components
├── .env.local                    # Environment variables
├── sample-output.json            # Example JSON output
└── README.md                     # This file
```

## Customization

- Modify the prompt in `src/app/api/generate/route.ts` to change the AI behavior
- Update the UI components in `src/app/page.tsx`
- Customize the JSON structure for different video generation tools
- Adjust the styling in `src/app/globals.css`

## Video Generation Integration

The structured output is designed to work with:
- Video editing software (Adobe Premiere, Final Cut Pro)
- AI video generation tools (Runway, Pika Labs, Sora)
- Automated video creation platforms
- Content management systems

## Deployment

The app is ready to deploy on:
- Vercel (recommended for Next.js)
- Netlify
- Any platform that supports Next.js

Make sure to set the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your deployment platform.

## License

MIT
