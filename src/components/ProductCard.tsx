import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  in_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!onAddToCart) return;
    setIsLoading(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!onToggleWishlist) return;
    await onToggleWishlist(product.id);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        {product.image_url && (
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          {onToggleWishlist && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleWishlist}
              className="p-2"
            >
              <Heart 
                className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {product.category && (
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.in_stock === false && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || product.in_stock === false}
          className="w-full"
        >
          {isLoading ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
