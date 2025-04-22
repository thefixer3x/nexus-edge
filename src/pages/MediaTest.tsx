
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
      <Card>
        <CardHeader>
          <CardTitle>Media Service Test Interface</CardTitle>
          <CardDescription>Test Shutterstock API integration and storage functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
