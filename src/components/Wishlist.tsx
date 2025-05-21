import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { fetchWishlist } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

interface WishlistProps {
  userId: string;
}

export function Wishlist({ userId }: WishlistProps) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist(userId);
        setWishlist(data);
      } catch (error) {
        // Handle error
      }
    };
    loadWishlist();
  }, [userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishlist.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
