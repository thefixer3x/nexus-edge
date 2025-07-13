
/// <reference lib="deno.window" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'
import { handleImageSearch, handleProductSearch, handleSimilarImages, handleImageStorage } from './handlers.ts'

// Environment variables from Supabase secrets
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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

// Create a Supabase client with the service role key
const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const { action, ...requestData } = await req.json()

    switch (action) {
      case 'search':
        return await handleImageSearch(requestData, corsHeaders, getAuthHeader)
      case 'product-search':
        return await handleProductSearch(requestData, corsHeaders, getAuthHeader)
      case 'similar':
        return await handleSimilarImages(requestData, corsHeaders, getAuthHeader)
      case 'store':
        return await handleImageStorage(requestData, corsHeaders, supabase)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
