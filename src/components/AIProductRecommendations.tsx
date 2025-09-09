import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reason: string;
  confidence: number;
}

interface AIProductRecommendationsProps {
  userId?: string;
}

export function AIProductRecommendations({ userId }: AIProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate AI recommendation API call
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: RecommendedProduct[] = [
        {
          id: 'rec-1',
          name: 'AI-Powered Smartwatch Pro',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
          rating: 4.8,
          reason: 'Perfect match for tech enthusiasts',
          confidence: 95
        },
        {
          id: 'rec-2',
          name: 'Ergonomic Office Chair',
          price: 279.99,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
          rating: 4.5,
          reason: 'Based on your work-from-home setup',
          confidence: 88
        },
        {
          id: 'rec-3',
          name: 'Fitness Tracker Band',
          price: 89.99,
          originalPrice: 129.99,
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop',
          rating: 4.4,
          reason: 'Trending in your area',
          confidence: 82
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    };

    fetchRecommendations();
  }, [userId]);

  const handleAddToCart = (product: RecommendedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
            AI is analyzing your preferences...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Recommendations For You
          <Badge variant="secondary" className="ml-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your browsing history and preferences
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-xs">
                    {product.confidence}% match
                  </Badge>
                  {product.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                      Sale
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                  {product.name}
                </h4>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  {product.reason}
                </p>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="text-blue-600 border-blue-200">
            View All AI Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}