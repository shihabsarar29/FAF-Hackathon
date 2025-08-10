'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Target, Cog, Image, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Our Story</h1>
            <p className="text-lg text-gray-600 mt-2">Building the future of interactive learning</p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              The Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg leading-relaxed">
            <p className="mb-4">
              I'm building a video-based learning platform where users can explore a product's supply chain, environmental impact, and health effects—all in an interactive, gamified way. Think Alchemy, where players combine "elements" to create products, or multiplayer quizzes with leaderboards to keep engagement high.
            </p>
            <p>
              Initially, I planned to generate videos using Veo 3, but with costs ranging from <strong>$15–$45 for a single one-minute video</strong>, mass adoption wasn't realistic. Video generation will eventually become cheaper, but I didn't want to wait. Instead, I designed a cost-optimized architecture that works now and can seamlessly upgrade to new tech later.
            </p>
          </CardContent>
        </Card>

        {/* Optimizations */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-500" />
                Optimization #1 – RAG for Video Reuse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Rather than regenerating similar videos, every generated video is indexed with a detailed description. A semantic search system retrieves and reuses relevant footage, so as the library grows, generation costs approach zero.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Cog className="w-6 h-6 text-green-500" />
                Optimization #2 – Step-based Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Most products share many steps. For example, two chocolate products might have 80% identical supply chain footage. By segmenting videos into reusable steps or effects, I can assemble complete videos from existing clips without regenerating them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Cog className="w-6 h-6 text-purple-500" />
                Optimization #3 – Modular Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                I separate audio, text, and charts from the main visuals. This makes the video clips more reusable—translations become trivial, and real-time data-driven charts can be overlaid, making the learning experience richer than static, fully generated videos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Image className="w-6 h-6 text-orange-500" />
                Optimization #4 – Image-first Video Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Even with segmentation, generating every clip as video is costly. To start, I use image sequences + text-to-speech to create videos at a fraction of the cost. Over time, I track which products and segments are most popular, then selectively replace those with higher-quality generated video.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Prototype Status
            </CardTitle>
            <CardDescription>What we've built so far</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">I've already built a working pipeline:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>User enters a product name.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>The system generates a detailed plan.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Multiple LLMs process different steps in parallel.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Images are generated with Gemini Imagen.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Audio is generated with OpenAI TTS.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Both are combined into a complete video.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology & Cost */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cost-Effective Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is powered by <strong>Groq LLaMA-4</strong> for ultra-fast inference, and the result is incredibly cost-effective—<span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">$0.10 for a first-time generation</span>, and <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">$0 for replays or indexed reuse</span>.
            </p>
            <p className="text-lg font-medium text-gray-700">
              Over time, the platform will evolve from an image-based MVP into a fully cinematic, dynamically assembled video learning system—without ever losing cost efficiency.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
            <p className="text-lg mb-6 opacity-90">
              Experience the future of product learning today. Try our Product Impact Explorer and see how we make complex supply chains accessible and engaging.
            </p>
            <Link href="/">
              <Button size="lg" variant="secondary">
                Start Exploring Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 