
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get request params from request body instead of URL
    // This is to match how the function is being called from the frontend
    const { contentId, filePath } = await req.json();

    if (!contentId || !filePath) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing secure media request for content ID: ${contentId}, file path: ${filePath}`)

    // Check if user has access to content using the updated database function
    const { data: contentData, error: contentError } = await supabaseClient
      .rpc('has_purchased_content', {
        user_id_param: user.id,
        content_id_param: contentId
      })

    if (contentError) {
      console.error('Error checking content access:', contentError)
      return new Response(
        JSON.stringify({ error: 'Access verification failed', details: contentError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    if (!contentData) {
      console.log('Access denied: User does not have permission to access this content')
      return new Response(
        JSON.stringify({ error: 'Access denied to content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('Access granted: Creating signed URL')

    // Get signed URL with short expiry
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('content-media')
      .createSignedUrl(filePath, 300) // 5 minutes

    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate secure URL', details: urlError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Secure URL generated successfully')

    return new Response(
      JSON.stringify({ secureUrl: urlData.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error in secure-media function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
