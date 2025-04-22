
import { SHUTTERSTOCK_API_BASE } from './config.ts'

// Shutterstock API authentication
export async function getAuthHeader() {
  const CLIENT_ID = Deno.env.get('SHUTTERSTOCK_CLIENT_ID')
  const CLIENT_SECRET = Deno.env.get('SHUTTERSTOCK_CLIENT_SECRET')

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing required Shutterstock API credentials')
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
}

// Handle image search requests
export async function handleImageSearch({ query, options }: any, corsHeaders: HeadersInit) {
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

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`Shutterstock API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Handle product-specific image search
export async function handleProductSearch({ productName }: any, corsHeaders: HeadersInit) {
  const enhancedQuery = `${productName} apple product white background professional`
  const options = {
    image_type: ['photo'],
    orientation: 'square',
    per_page: 5,
    sort: 'relevance'
  }

  return handleImageSearch({ query: enhancedQuery, options }, corsHeaders)
}

// Handle similar image search
export async function handleSimilarImages({ imageUrl }: any, corsHeaders: HeadersInit) {
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`)
  }

  const imageArrayBuffer = await imageResponse.arrayBuffer()
  const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)))

  const headers = await getAuthHeader()
  const response = await fetch(`${SHUTTERSTOCK_API_BASE}/cv/similar/images`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ base64_image: base64Image })
  })

  if (!response.ok) {
    throw new Error(`Shutterstock API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Handle image storage
export async function handleImageStorage(
  { imageUrl, path }: any,
  corsHeaders: HeadersInit,
  supabase: any
) {
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`)
  }

  const imageArrayBuffer = await imageResponse.arrayBuffer()

  try {
    const { data: buckets } = await supabase.storage.getBucket('apple-store-images')
    if (!buckets) {
      await supabase.storage.createBucket('apple-store-images', {
        public: true
      })
      console.log('Created bucket: apple-store-images')
    }
  } catch (error: any) {
    if (error.message.includes('does not exist')) {
      await supabase.storage.createBucket('apple-store-images', {
        public: true
      })
      console.log('Created bucket: apple-store-images')
    } else {
      console.error('Error checking/creating bucket:', error)
      throw error
    }
  }

  const { data, error } = await supabase
    .storage
    .from('apple-store-images')
    .upload(path, imageArrayBuffer, {
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
      upsert: true
    })

  if (error) throw error

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
