
/// <reference lib="deno.window" />

import { SHUTTERSTOCK_API_BASE } from './config.ts'

// Define a custom error class for API errors
class ShutterstockApiError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = 'ShutterstockApiError';
  }
}

// Simple in-memory rate limiter
class RateLimiter {
  private requests: number[] = [];
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public async consume(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const timeLeft = this.windowMs - (now - this.requests[0]);
      throw new ShutterstockApiError(`Rate limit exceeded. Please try again in ${Math.ceil(timeLeft / 1000)} seconds.`, 429);
    }

    this.requests.push(now);
  }
}

// Initialize rate limiter (e.g., 100 requests per minute)
const shutterstockRateLimiter = new RateLimiter(60 * 1000, 100);


// Utility function for fetching with retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      } else if (response.status >= 500 || response.status === 429) { // Retry on 5xx or Too Many Requests
        console.warn(`Attempt ${i + 1} failed for ${url} with status ${response.status}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        const errorDetails = await response.json().catch(() => ({}));
        throw new ShutterstockApiError(`Shutterstock API error: ${response.status} ${response.statusText}`, response.status, errorDetails);
      }
    } catch (error) {
      if (error instanceof ShutterstockApiError) {
        throw error; // Re-throw specific API errors immediately
      }
      console.error(`Network or unexpected error on attempt ${i + 1} for ${url}:`, error);
      if (i === retries - 1) {
        throw new Error(`Failed to fetch ${url} after ${retries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error('Unexpected error in fetchWithRetry'); // Should not be reached
}

// Handle image search requests
export async function handleImageSearch({ query, options }: any, corsHeaders: HeadersInit, getAuthHeader: () => Promise<HeadersInit>) {
  try {
    await shutterstockRateLimiter.consume(); // Apply rate limiting
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, details: error.details }),
      { status: error.status || 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

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
    const response = await fetchWithRetry(url, { headers });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in handleImageSearch:', error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.details }),
      { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle product-specific image search
export async function handleProductSearch({ productName }: any, corsHeaders: HeadersInit, getAuthHeader: () => Promise<HeadersInit>) {
  const enhancedQuery = `${productName} apple product white background professional`
  const options = {
    image_type: ['photo'],
    orientation: 'square',
    per_page: 5,
    sort: 'relevance'
  }

  return handleImageSearch({ query: enhancedQuery, options }, corsHeaders, getAuthHeader)
}

// Handle similar image search
export async function handleSimilarImages({ imageUrl }: any, corsHeaders: HeadersInit, getAuthHeader: () => Promise<HeadersInit>) {
  try {
    await shutterstockRateLimiter.consume(); // Apply rate limiting
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, details: error.details }),
      { status: error.status || 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const imageResponse = await fetchWithRetry(imageUrl, {});
    if (!imageResponse.ok) {
      throw new ShutterstockApiError(`Failed to fetch image from URL: ${imageResponse.status}`, imageResponse.status);
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)));

    const headers = await getAuthHeader();
    const response = await fetchWithRetry(`${SHUTTERSTOCK_API_BASE}/cv/similar/images`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ base64_image: base64Image })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in handleSimilarImages:', error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.details }),
      { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle image storage
export async function handleImageStorage(
  { imageUrl, path }: any,
  corsHeaders: HeadersInit,
  supabase: any
) {
  try {
    const imageResponse = await fetchWithRetry(imageUrl, {});
    if (!imageResponse.ok) {
      throw new ShutterstockApiError(`Failed to fetch image from URL for storage: ${imageResponse.status}`, imageResponse.status);
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();

    // Supabase storage bucket access policies:
    // The 'apple-store-images' bucket is created with `public: true` for easy access.
    // In a production environment, consider more granular RLS (Row Level Security) policies
    // to restrict access based on user roles or other criteria.
    // For example, only authenticated users should be able to upload, and only
    // specific roles should be able to delete or modify images.
    try {
      const { data: buckets } = await supabase.storage.getBucket('apple-store-images');
      if (!buckets) {
        await supabase.storage.createBucket('apple-store-images', {
          public: true
        });
        console.log('Created bucket: apple-store-images');
      }
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        await supabase.storage.createBucket('apple-store-images', {
          public: true
        });
        console.log('Created bucket: apple-store-images');
      } else {
        console.error('Error checking/creating bucket:', error);
        throw new ShutterstockApiError('Supabase bucket operation failed', 500, error.message);
      }
    }

    const { data, error } = await supabase
      .storage
      .from('apple-store-images')
      .upload(path, imageArrayBuffer, {
        contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });

    if (error) {
      throw new ShutterstockApiError('Supabase image upload failed', 500, error.message);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in handleImageStorage:', error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.details }),
      { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
