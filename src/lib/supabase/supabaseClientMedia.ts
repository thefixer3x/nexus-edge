import { createClient } from '@supabase/supabase-js'

// Media-specific Supabase client
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY

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
