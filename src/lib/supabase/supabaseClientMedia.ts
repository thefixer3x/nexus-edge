
import { createClient } from '@supabase/supabase-js'

// Media-specific Supabase client (using the same project as app client for now)
// In the future, this could be moved to a dedicated media services project
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
 * 
 * @param query Search term
 * @param options Additional search parameters
 * @returns Image search results
 */
export const searchImages = async (
  query: string, 
  options?: SearchOptions
): Promise<ImageSearchResult> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { 
        query,
        options
      },
      method: 'POST',
      path: '/search',
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
 * 
 * @param productName Name of the product
 * @returns Image search results
 */
export const searchProductImages = async (
  productName: string
): Promise<ImageSearchResult> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { productName },
      method: 'POST',
      path: '/product-images',
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching product images:', error)
    throw error
  }
}

/**
 * Find similar images using computer vision
 * 
 * @param imageUrl URL of the image to use as reference
 * @returns Similar image results
 */
export const getSimilarImages = async (
  imageUrl: string
): Promise<ImageSearchResult> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { imageUrl },
      method: 'POST',
      path: '/similar',
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error finding similar images:', error)
    throw error
  }
}

/**
 * Store an image in Supabase storage
 * 
 * @param imageUrl URL of the image to store
 * @param path Storage path
 * @returns Storage operation result
 */
export const storeImage = async (
  imageUrl: string,
  path: string
): Promise<any> => {
  try {
    const { data, error } = await supabaseMedia.functions.invoke('shutterstock-api', {
      body: { imageUrl, path },
      method: 'POST',
      path: '/store',
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error storing image:', error)
    throw error
  }
}

/**
 * Get a stored image URL
 * 
 * @param path Storage path of the image
 * @returns Public URL of the image
 */
export const getStoredImageUrl = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabaseMedia
      .storage
      .from('apple-store-images')
      .getPublicUrl(path)
    
    if (error) throw error
    return data.publicUrl
  } catch (error) {
    console.error('Error getting stored image URL:', error)
    throw error
  }
}
