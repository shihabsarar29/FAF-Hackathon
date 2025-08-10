'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SupplyChainStep {
  stepNumber: number;
  stage: string;
  title: string;
  description: string;
  keyActivities: string[];
  estimatedDuration: string;
  keyStakeholders: string[];
  videoScript: string;
}

interface SupplyChainData {
  productName: string;
  supplyChainSteps: SupplyChainStep[];
}

export default function Home() {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [supplyChain, setSupplyChain] = useState<SupplyChainData | null>(null);

  const generateSupplyChain = async () => {
    if (!productName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      });
      
      const data = await response.json();
      setSupplyChain(data.supplyChain);
    } catch (error) {
      console.error('Error generating supply chain:', error);
      setSupplyChain(null);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!supplyChain) return;
    
    const dataStr = JSON.stringify(supplyChain, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${supplyChain.productName.replace(/\s+/g, '_')}_supply_chain.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadVideoScripts = () => {
    if (!supplyChain) return;
    
    let scriptsContent = `Supply Chain Video Scripts for ${supplyChain.productName}\n`;
    scriptsContent += '='.repeat(50) + '\n\n';
    
    supplyChain.supplyChainSteps.forEach((step) => {
      scriptsContent += `STEP ${step.stepNumber}: ${step.stage.toUpperCase()}\n`;
      scriptsContent += '-'.repeat(30) + '\n';
      scriptsContent += `Title: ${step.title}\n`;
      scriptsContent += `Duration: ${step.estimatedDuration}\n\n`;
      scriptsContent += `Video Script:\n${step.videoScript}\n\n`;
      scriptsContent += `Key Activities:\n`;
      step.keyActivities.forEach(activity => {
        scriptsContent += `• ${activity}\n`;
      });
      scriptsContent += `\nKey Stakeholders:\n`;
      step.keyStakeholders.forEach(stakeholder => {
        scriptsContent += `• ${stakeholder}\n`;
      });
      scriptsContent += '\n' + '='.repeat(50) + '\n\n';
    });
    
    const dataBlob = new Blob([scriptsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${supplyChain.productName.replace(/\s+/g, '_')}_video_scripts.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supply Chain Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate step-wise supply chain procedures for any product using AI
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the name of the product to generate its supply chain procedure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter product name (e.g., Smartphone, Coffee, T-shirt)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={generateSupplyChain}
              disabled={isLoading || !productName.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Generating...' : 'Generate Supply Chain'}
            </Button>
          </CardContent>
        </Card>

        {supplyChain && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Supply Chain Procedure for: {supplyChain.productName}
                  <div className="flex gap-2">
                    <Button onClick={downloadJSON} variant="outline" size="sm">
                      Download JSON
                    </Button>
                    <Button onClick={downloadVideoScripts} variant="outline" size="sm">
                      Download Video Scripts
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Structured data for video generation and analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              {supplyChain.supplyChainSteps.map((step, index) => (
                <Card key={`step-${index}`} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.stepNumber}
                      </span>
                      <div>
                        <div className="text-lg">{step.stage}</div>
                        <div className="text-sm text-gray-600 font-normal">{step.title}</div>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Estimated Duration: {step.estimatedDuration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Activities:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {step.keyActivities.map((activity, idx) => (
                            <li key={idx} className="text-gray-700">{activity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Key Stakeholders:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {step.keyStakeholders.map((stakeholder, idx) => (
                            <li key={idx} className="text-gray-700">{stakeholder}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Video Script:</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 text-sm">{step.videoScript}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Raw JSON Data</CardTitle>
                <CardDescription>
                  Complete structured data for API integration and video generation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(supplyChain, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
