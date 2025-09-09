import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AIChatSupport } from '@/components/AIChatSupport';
import { AIProductRecommendations } from '@/components/AIProductRecommendations';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export default function ProductListing() {
  const user = useUserStore((state) => state.user);
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const demoProducts: Product[] = [
      {
        id: '1',
        name: 'AI-Powered Smartwatch Pro',
        price: 299.99,
        originalPrice: 399.99,
        description: 'Revolutionary smartwatch with advanced AI health monitoring and predictive analytics.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        category: 'Electronics',
        rating: 4.8,
        reviews: 2847,
        featured: true
      },
      {
        id: '2',
        name: 'Premium Wireless Headphones',
        price: 199.99,
        description: 'Noise-cancelling headphones with crystal clear sound and 30-hour battery life.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        category: 'Electronics',
        rating: 4.6,
        reviews: 1523
      },
      {
        id: '3',
        name: 'Smart Home Security Camera',
        price: 149.99,
        originalPrice: 199.99,
        description: 'AI-powered security camera with facial recognition and cloud storage.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'Smart Home',
        rating: 4.7,
        reviews: 892
      },
      {
        id: '4',
        name: 'Ergonomic Office Chair',
        price: 279.99,
        description: 'Premium ergonomic chair designed for maximum comfort during long work sessions.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        category: 'Furniture',
        rating: 4.5,
        reviews: 634,
        featured: true
      },
      {
        id: '5',
        name: 'Fitness Tracker Band',
        price: 89.99,
        originalPrice: 129.99,
        description: 'Advanced fitness tracking with heart rate monitoring and sleep analysis.',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
        category: 'Health & Fitness',
        rating: 4.4,
        reviews: 1247
      },
      {
        id: '6',
        name: 'Portable Bluetooth Speaker',
        price: 79.99,
        description: 'Waterproof portable speaker with 360-degree sound and 12-hour battery.',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
        category: 'Electronics',
        rating: 4.3,
        reviews: 756
      }
    ];
    setProducts(demoProducts);
  }, []);

  const categories = ['all', 'Electronics', 'Smart Home', 'Furniture', 'Health & Fitness'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
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
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">AI-Curated Marketplace</h1>
      </div>

      <AIProductRecommendations userId={user?.id} />

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-blue-600">
                    Featured
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Sale
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-semibold text-lg cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}

      <AIChatSupport />
    </div>
  );
}
