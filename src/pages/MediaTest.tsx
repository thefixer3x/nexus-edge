
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { searchImages, searchProductImages, storeImage } from '@/lib/supabase/supabaseClientMedia';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from 'lucide-react';

export const MediaTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const results = await searchImages(searchQuery);
      setSearchResults(results.data || []);
      toast.success(`Found ${results.data.length} images`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSearch = async () => {
    try {
      setIsLoading(true);
      const results = await searchProductImages(searchQuery);
      setSearchResults(results.data || []);
      toast.success(`Found ${results.data.length} product images`);
    } catch (error) {
      console.error('Product search error:', error);
      toast.error('Failed to search product images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreImage = async (imageUrl: string) => {
    try {
      const storagePath = `test/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      await storeImage(imageUrl, storagePath);
      toast.success('Image stored successfully');
    } catch (error) {
      console.error('Storage error:', error);
      toast.error('Failed to store image');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Media Service Test Guide
          </CardTitle>
          <CardDescription>
            This interface allows you to explore and interact with our media search and storage capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-white rounded-b-lg p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h3 className="font-semibold text-yellow-700 mb-2">How to Use:</h3>
            <ol className="list-decimal list-inside text-yellow-800 space-y-2">
              <li>Enter a search term in the input field (e.g., "Apple", "Landscape", "Technology")</li>
              <li>Click "Search Images" for general image results</li>
              <li>Click "Search Products" for product-specific image results</li>
              <li>Browse the images that appear</li>
              <li>Click "Store Image" on any image to save it to our media storage</li>
            </ol>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Enter search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              Search Images
            </Button>
            <Button onClick={handleProductSearch} disabled={isLoading} variant="secondary">
              Search Products
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {searchResults.map((image: any, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <img
                    src={image.assets.preview.url}
                    alt={image.description}
                    className="w-full h-48 object-cover rounded"
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleStoreImage(image.assets.preview.url)}
                    className="w-full"
                  >
                    Store Image
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaTest;
