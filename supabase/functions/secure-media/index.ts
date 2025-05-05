
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache to reduce DB queries within the edge function
const accessCache = new Map<string, {
  hasAccess: boolean,
  timestamp: number
}>();

// Cache duration: 15 minutes
const CACHE_TTL = 15 * 60 * 1000;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Secure media function called")
    
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
      error: userError
    } = await supabaseClient.auth.getUser()

    if (userError) {
      console.error("Authentication error:", userError.message)
      return new Response(
        JSON.stringify({ error: 'Authentication error', details: userError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    if (!user) {
      console.error("Unauthorized: No authenticated user found")
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Parse request body
    let contentId, filePath;
    try {
      const body = await req.json();
      contentId = body.contentId;
      filePath = body.filePath;
    } catch (e) {
      console.error("Error parsing request body:", e)
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: e.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!contentId || !filePath) {
      console.error("Missing required parameters: contentId or filePath")
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: contentId and filePath must be provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `${user.id}:${contentId}`;
    const cachedAccess = accessCache.get(cacheKey);
    
    if (cachedAccess && (Date.now() - cachedAccess.timestamp < CACHE_TTL)) {
      console.log(`Using cached access check for ${cacheKey}: ${cachedAccess.hasAccess}`);
      
      if (!cachedAccess.hasAccess) {
        return new Response(
          JSON.stringify({ error: 'Access denied to content' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }
    } else {
      console.log(`Checking if user ${user.id} has access to content ${contentId}`);
      
      // Check if the user has access using the database function
      const { data: hasAccess, error: accessError } = await supabaseClient
        .rpc('has_purchased_content', {
          user_id_param: user.id,
          content_id_param: contentId
        });

      if (accessError) {
        console.error('Error checking content access:', accessError)
        return new Response(
          JSON.stringify({ error: 'Access verification failed', details: accessError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }

      if (!hasAccess) {
        // Cache the negative access check
        accessCache.set(cacheKey, {
          hasAccess: false,
          timestamp: Date.now()
        });
        
        console.error('Access denied: User does not have permission to access this content')
        return new Response(
          JSON.stringify({ error: 'Access denied to content' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }
      
      // Cache the positive access check
      accessCache.set(cacheKey, {
        hasAccess: true,
        timestamp: Date.now()
      });
    }

    // Get signed URL with short expiry
    console.log(`Creating signed URL for file: ${filePath}`)
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('content-media')
      .createSignedUrl(filePath, 300) // 5 minutes
      
    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      
      // Try getting content info from database if available
      const { data: contentData, error: contentError } = await supabaseClient
        .from('contents')
        .select('file_path')
        .eq('id', contentId)
        .single();
      
      if (contentError || !contentData || !contentData.file_path) {
        return new Response(
          JSON.stringify({ error: 'Failed to generate secure URL', details: urlError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // Try with file path from the database if different
      if (contentData.file_path !== filePath) {
        console.log(`Trying with file path from database: ${contentData.file_path}`);
        const { data: altUrlData, error: altUrlError } = await supabaseClient
          .storage
          .from('content-media')
          .createSignedUrl(contentData.file_path, 300) // 5 minutes
          
        if (altUrlError) {
          console.error('Error generating signed URL with alternate path:', altUrlError);
          return new Response(
            JSON.stringify({ error: 'Failed to generate secure URL' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        console.log('Secure URL generated successfully using database file path');
        return new Response(
          JSON.stringify({ secureUrl: altUrlData.signedUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ error: 'Failed to generate secure URL', details: urlError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    console.log('Secure URL generated successfully');

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
