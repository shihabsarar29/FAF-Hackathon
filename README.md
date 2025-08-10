# Product Knowledge Platform

A Next.js web application that helps users explore products through AI-powered analysis of supply chains, environmental impacts, health effects, and historical origins. Features automatic image and audio generation with interactive video presentations.

## Vision

Instead of social media reels, people will be checking out product reels—discovering the fascinating stories behind everyday items through engaging, bite-sized video content that educates while it entertains.

## Features

### 🔍 **Multi-Dimensional Product Analysis**
- **Supply Chain Steps**: Core production and manufacturing processes
- **Environmental Effects**: Positive and negative environmental impacts 
- **Health Effects**: Health-related impacts and benefits
- **History of Origin**: Historical development and origins

### 🎥 **Interactive Video Presentations**
- **Automatic playback** with synchronized images and audio
- **Step navigation** with visual progress tracking
- **Professional narration** using AI-generated audio
- **Responsive video player** with play/pause/stop controls

### 🎨 **AI-Powered Content Generation**
- **Parallel image generation** for all analysis items
- **Professional photography-style** images
- **Text-to-speech audio** narration
- **Context-aware prompts** for each content type

### 💻 **Modern User Experience**
- **Clean, responsive design** built with Tailwind CSS and shadcn/ui
- **Real-time generation progress** with loading states
- **Automatic workflow** - no manual button clicking needed
- **Download capabilities** for generated content

## Technology Stack

### **Frontend**
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Responsive design

### **AI & APIs**
- **Groq LLaMA-4** for ultra-fast content generation
- **Google Gemini Imagen** for image generation
- **OpenAI TTS** for audio narration
- Parallel processing for optimal performance

### **Cost Optimization**
- **$0.10** for first-time generation
- **$0** for replays and indexed reuse
- Image-first video generation approach
- Modular media architecture for reusability

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### API Keys Required
- `GROQ_API_KEY` for content generation
- `GOOGLE_GENERATIVE_AI_API_KEY` for image generation
- `OPENAI_API_KEY` for audio generation

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd supply-chain-generator
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Workflow
1. **Enter Product Name**: Type any product (e.g., "Smartphone", "Coffee", "T-shirt")
2. **Choose Analysis Type**: Select from supply chain, environmental, health, or history
3. **Automatic Generation**: Watch as the platform automatically:
   - Generates overview and detailed analysis
   - Creates professional images for each step
   - Generates audio narration
   - Assembles everything into a video presentation

### Content Types

#### 🏭 **Supply Chain Analysis**
- Raw material sourcing
- Manufacturing processes
- Quality control
- Distribution and retail

#### 🌍 **Environmental Impact**
- Positive environmental effects
- Negative environmental impacts
- Sustainability practices
- Carbon footprint analysis

#### 🏥 **Health Effects**
- Positive health benefits
- Potential health risks
- Usage recommendations
- Safety considerations

#### 📚 **Historical Origins**
- Product development timeline
- Cultural significance
- Innovation milestones
- Evolution over time

## Project Structure

```
supply-chain-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/              # Content generation
│   │   │   ├── generate-step-details/ # Detailed analysis
│   │   │   ├── generate-images/       # Image generation
│   │   │   └── generate-audio/        # Audio generation
│   │   ├── story/                     # Story page
│   │   │   └── page.tsx
│   │   ├── page.tsx                   # Main application
│   │   └── layout.tsx                 # App layout
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   └── VideoPresentation.tsx     # Video player component
│   └── hooks/
│       └── useGeminiAudio.ts          # Audio generation hook
├── public/                            # Static assets
├── .env.local                         # Environment variables
└── README.md                          # This file
```

## Key Optimizations

### 🎯 **RAG for Video Reuse**
Semantic search system retrieves and reuses relevant footage as the library grows, approaching zero generation costs over time.

### ⚙️ **Step-based Segmentation** 
Products share many identical steps (80%+ reuse rate), allowing efficient assembly from existing clips without regeneration.

### 🔧 **Modular Media**
Separate audio, text, and charts from visuals for maximum reusability and real-time data integration.

### 🖼️ **Image-first Generation**
Start with cost-effective image sequences + TTS, then selectively upgrade popular content to full video.

## Output Formats

### Analysis Data
```json
{
  "productName": "Product Name",
  "supplyChainSteps": [
    {
      "stepNumber": 1,
      "stage": "Manufacturing",
      "title": "Component Assembly",
      "description": "Detailed process description",
      "imagePrompt": "Professional photography prompt",
      "videoScript": "Narration script",
      "isDetailed": true
    }
  ]
}
```

### Generated Content
```json
{
  "images": [
    {
      "stepNumber": 1,
      "success": true,
      "imageData": "base64_image_data",
      "imagePrompt": "Generation prompt used"
    }
  ],
  "audio": [
    {
      "stepNumber": 1,
      "success": true,
      "audioData": "base64_audio_data",
      "mimeType": "audio/mpeg"
    }
  ]
}
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```
GROQ_API_KEY=your_production_groq_key
GOOGLE_GENERATIVE_AI_API_KEY=your_production_google_key
OPENAI_API_KEY=your_production_openai_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Future Roadmap

- **Multiplayer quizzes** with leaderboards
- **Gamified exploration** like Alchemy game mechanics
- **Video generation upgrade** from image sequences
- **RAG-powered content reuse** system
- **Real-time data integration** for dynamic content

## License

MIT

---

**Experience the future of product learning today.** Try our Product Knowledge Platform and see how we make complex supply chains accessible and engaging.
