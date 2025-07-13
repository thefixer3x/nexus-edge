import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductRecommendation = {
  id: string;
  name: string;
  price: number;
  image: string;
  reason: string;
};

export const AIProductRecommendations = () => {
  // Mock recommendations - in a real app, these would come from an AI service
  const recommendations: ProductRecommendation[] = [
    {
      id: 'rec1',
      name: 'Premium Developer Keyboard',
      price: 149.99,
      image: '/images/keyboard.jpg',
      reason: 'Based on your interest in development tools',
    },
    {
      id: 'rec2',
      name: 'Code Quality Monitor',
      price: 299.99,
      image: '/images/monitor.jpg',
      reason: 'Frequently bought with development IDEs',
    },
    {
      id: 'rec3',
      name: 'AI Coding Assistant Premium',
      price: 19.99,
      image: '/images/ai-coding.jpg',
      reason: 'Trending among developers in your area',
    },
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">AI Recommended Products</CardTitle>
        <CardDescription>
          Based on your browsing history and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                {/* Placeholder for product image */}
                <div className="text-muted-foreground text-sm">Product Image</div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  {product.reason}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            See more recommendations →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};