
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

// Shutterstock API base URL
const SHUTTERSTOCK_API_BASE = 'https://api.shutterstock.com/v2'

// Environment variables from Supabase secrets
const CLIENT_ID = Deno.env.get('SHUTTERSTOCK_CLIENT_ID')
const CLIENT_SECRET = Deno.env.get('SHUTTERSTOCK_CLIENT_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Create a Supabase client with the service role key
const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

// Verify required environment variables
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing required Shutterstock API credentials')
}

interface SearchOptions {
  image_type?: string[]
  orientation?: string
  aspect_ratio?: number
  page?: number
  per_page?: number
  sort?: string
  view?: string
}

interface ImageSearchRequest {
  query: string
  options?: SearchOptions
}

// Shutterstock API authentication
async function getAuthHeader() {
  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
}

// Search for images
async function searchImages(query: string, options: SearchOptions = {}) {
  // Default search parameters
  const params = new URLSearchParams({
    query,
    image_type: options.image_type?.join(',') || 'photo',
    orientation: options.orientation || 'horizontal',
    sort: options.sort || 'popular',
    per_page: (options.per_page || 10).toString(),
    page: (options.page || 1).toString(),
    view: options.view || 'minimal',
  })

  const url = `${SHUTTERSTOCK_API_BASE}/images/search?${params.toString()}`
  const headers = await getAuthHeader()

  try {
    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      throw new Error(`Shutterstock API error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching images:', error)
    throw error
  }
}

// Store image in Supabase storage
async function storeImage(imageUrl: string, path: string) {
  try {
    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
    }
    
    // Convert image to array buffer
    const imageArrayBuffer = await imageResponse.arrayBuffer()
    
    // Create the bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.getBucket('apple-store-images')
      if (!buckets) {
        await supabase.storage.createBucket('apple-store-images', {
          public: true
        })
        console.log('Created bucket: apple-store-images')
      }
    } catch (error) {
      if (error.message.includes('does not exist')) {
        await supabase.storage.createBucket('apple-store-images', {
          public: true
        })
        console.log('Created bucket: apple-store-images')
      } else {
        console.error('Error checking/creating bucket:', error)
      }
    }
    
    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('apple-store-images')
      .upload(path, imageArrayBuffer, {
        contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
        upsert: true
      })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error storing image:', error)
    throw error
  }
}

// Get similar images using computer vision
async function getSimilarImages(imageUrl: string) {
  try {
    // First, we need to download the image and convert to base64
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
    }
    
    const imageArrayBuffer = await imageResponse.arrayBuffer()
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(imageArrayBuffer))
    )
    
    const headers = await getAuthHeader()
    const response = await fetch(`${SHUTTERSTOCK_API_BASE}/cv/similar/images`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ base64_image: base64Image })
    })
    
    if (!response.ok) {
      throw new Error(`Shutterstock API error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting similar images:', error)
    throw error
  }
}

// Product-specific image search
async function searchProductImages(productName: string) {
  // Enhance the search query for better product image results
  // Add specific terms to improve relevance for Apple products
  const enhancedQuery = `${productName} apple product white background professional`
  
  return searchImages(enhancedQuery, {
    image_type: ['photo'],
    orientation: 'square',
    per_page: 5,
    sort: 'relevance'
  })
}

// Main handler for the edge function
serve(async (req) => {
  try {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const { action, query, options, productName, imageUrl, storagePath } = await req.json()

    // Handle different API endpoints based on action
    switch (action) {
      case 'search':
        const searchResults = await searchImages(query, options)
        return new Response(JSON.stringify(searchResults), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'product-search':
        const productResults = await searchProductImages(productName)
        return new Response(JSON.stringify(productResults), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'store':
        const storeResult = await storeImage(imageUrl, storagePath)
        return new Response(JSON.stringify({ url: storeResult }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})
