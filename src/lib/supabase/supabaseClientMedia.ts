
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

// Media-specific Supabase client using the same credentials as our main client
const supabaseUrl = "https://rsabczhfeehazuyajarx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYWJjemhmZWVoYXp1eWFqYXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjY2MTEsImV4cCI6MjA1ODE0MjYxMX0.UldOcr7qhvX6Wa77fGoB8pkHOgv8HulcMsX_zULttNI"

export const supabaseMedia = createClient(supabaseUrl, supabaseAnonKey)

// Interface for image search options
interface SearchOptions {
  image_type?: string[];
  orientation?: string;
  aspect_ratio?: number;
  page?: number;
  per_page?: number;
  sort?: string;
  view?: string;
}

// Interface for image search results
interface ImageSearchResult {
  page: number;
  per_page: number;
  total_count: number;
  search_id: string;
  data: any[]; // Simplified for now, would be more specific in actual implementation
}

/**
 * Search for images using the Shutterstock API
 */
export const searchImages = async (
  query: string, 
  options?: SearchOptions
): Promise<ImageSearchResult> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { 
        query,
        options,
        action: 'search'
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching images:', error)
    throw error
  }
}

/**
 * Search for product-specific images
 */
export const searchProductImages = async (
  productName: string
): Promise<ImageSearchResult> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { 
        productName,
        action: 'product-search'
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching product images:', error)
    throw error
  }
}

/**
 * Store an image in Supabase storage
 */
export const storeImage = async (
  imageUrl: string,
  storagePath: string
): Promise<string> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { 
        imageUrl, 
        storagePath,
        action: 'store'
      }
    })
    
    if (error) throw error
    return data.url
  } catch (error) {
    console.error('Error storing image:', error)
    throw error
  }
}

/**
 * Get a stored image URL
 */
export const getStoredImageUrl = async (storagePath: string): Promise<string> => {
  try {
    const { data } = await supabaseMedia
      .storage
      .from('apple-store-images')
      .getPublicUrl(storagePath)
    
    return data.publicUrl
  } catch (error) {
    console.error('Error getting stored image URL:', error)
    throw error
  }
}
