import { useState, useEffect } from 'react';
import { searchProductImages, getStoredImageUrl, storeImage } from '@/lib/supabase/supabaseClientMedia';

interface UseImageOptions {
  useCache?: boolean;
  fallbackUrl?: string;
}

/**
 * Hook for fetching product images from Shutterstock with caching
 * 
 * @param productName Name of the product
 * @param productId Unique identifier for the product
 * @param options Configuration options
 * @returns Image URL and loading state
 */
export const useImage = (
  productName: string, 
  productId: string,
  options: UseImageOptions = {}
) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { useCache = true, fallbackUrl = '/placeholder.svg' } = options;

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if we have a cached version
        if (useCache) {
          try {
            const storedImageUrl = await getStoredImageUrl(`products/${productId}`);
            if (storedImageUrl) {
              setImageUrl(storedImageUrl);
              setIsLoading(false);
              return;
            }
          } catch (cacheError) {
            console.log('No cached image found, searching Shutterstock');
          }
        }
        
        // Search for the product image
        const result = await searchProductImages(productName);
        
        if (result.data && result.data.length > 0) {
          // Get the best image from the results
          const image = result.data[0];
          setImageUrl(image.assets.preview.url);
          
          // If caching is enabled, store the image
          if (useCache) {
            try {
              await storeImage(image.assets.preview.url, `products/${productId}`);
            } catch (storeError) {
              console.error('Failed to cache image:', storeError);
            }
          }
        } else {
          setImageUrl(fallbackUrl);
        }
      } catch (fetchError) {
        console.error('Error fetching image:', fetchError);
        setError(fetchError as Error);
        setImageUrl(fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productName) {
      fetchImage();
    } else {
      setImageUrl(fallbackUrl);
      setIsLoading(false);
    }
  }, [productName, productId, useCache, fallbackUrl]);

  return { imageUrl, isLoading, error };
};
