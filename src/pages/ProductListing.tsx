import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIChatSupport } from '@/components/AIChatSupport';
import { AIProductRecommendations } from '@/components/AIProductRecommendations';
import { AISettingsSuggestion } from '@/components/AISettingsSuggestion';

const ProductListing = () => {
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setProducts([
      { id: 1, name: 'Product 1', price: 99.99, description: 'Description 1', image: '/placeholder.svg' },
      { id: 2, name: 'Product 2', price: 149.99, description: 'Description 2', image: '/placeholder.svg' },
      // ...more products
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-4">Product Listing</h1>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline">All Products</Badge>
        <Badge variant="outline">Development Tools</Badge>
        <Badge variant="outline">AI Assistants</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        This is a placeholder for the Product Listing page.
      </p>
      <div className="mb-8">
        <AIProductRecommendations userId={user?.id} />
        <AISettingsSuggestion />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Badge variant="outline" className="ml-2">
                  ${product.price}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button variant="outline">View Details</Button>
              <Button>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* AI Chat Support floating widget */}
      <AIChatSupport />
    </div>
  );
};

export default ProductListing;
