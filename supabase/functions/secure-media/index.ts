
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
    console.log("Supabase client created")

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

    console.log(`Authenticated user: ${user.id}`)

    // Parse request body
    let contentId, filePath;
    try {
      const body = await req.json();
      contentId = body.contentId;
      filePath = body.filePath;
      console.log(`Received request for contentId: ${contentId}, filePath: ${filePath}`)
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

    console.log(`Processing secure media request for content ID: ${contentId}, file path: ${filePath}`)
    
    // Verify the content exists first
    const { data: contentData, error: contentError } = await supabaseClient
      .from('contents')
      .select('id, file_path')
      .eq('id', contentId)
      .single();
      
    if (contentError) {
      console.error(`Error fetching content with ID ${contentId}:`, contentError)
      return new Response(
        JSON.stringify({ error: 'Content not found', details: contentError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    if (!contentData) {
      console.error(`Content with ID ${contentId} does not exist`)
      return new Response(
        JSON.stringify({ error: 'Content not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    console.log(`Content found. Database file path: ${contentData.file_path}, requested path: ${filePath}`)
    
    // Check if the user has access using the database function
    console.log(`Checking if user ${user.id} has purchased content ${contentId}`)
    const { data: hasAccess, error: accessError } = await supabaseClient
      .rpc('has_purchased_content', {
        user_id_param: user.id,
        content_id_param: contentId
      })

    if (accessError) {
      console.error('Error checking content access:', accessError)
      return new Response(
        JSON.stringify({ error: 'Access verification failed', details: accessError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    if (!hasAccess) {
      console.error('Access denied: User does not have permission to access this content')
      return new Response(
        JSON.stringify({ error: 'Access denied to content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('Access granted: Creating signed URL')
    
    // Check if the storage bucket exists
    const { data: buckets, error: bucketsError } = await supabaseClient
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return new Response(
        JSON.stringify({ error: 'Storage error', details: bucketsError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    const contentMediaBucket = buckets.find(b => b.name === 'content-media');
    if (!contentMediaBucket) {
      console.error('Storage bucket "content-media" not found')
      return new Response(
        JSON.stringify({ error: 'Storage configuration error: bucket not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    console.log('Storage bucket "content-media" found')
    
    // Check if the file exists in storage
    try {
      const { data: fileInfo, error: fileError } = await supabaseClient
        .storage
        .from('content-media')
        .getPublicUrl(filePath, { download: false });
        
      if (fileError) {
        console.error('Error checking file existence:', fileError)
        return new Response(
          JSON.stringify({ error: 'File not found', details: fileError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      console.log('File exists in storage, public URL:', fileInfo.publicUrl)
    } catch (e) {
      console.error('Error checking file existence:', e)
    }

    // Get signed URL with short expiry
    console.log(`Creating signed URL for file: ${filePath}`)
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('content-media')
      .createSignedUrl(filePath, 300) // 5 minutes
      
    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      
      // If file not found, try with the file_path from the database
      if (urlError.message && urlError.message.includes('Object not found') && contentData.file_path && contentData.file_path !== filePath) {
        console.log(`Trying with file path from database: ${contentData.file_path}`)
        const { data: altUrlData, error: altUrlError } = await supabaseClient
          .storage
          .from('content-media')
          .createSignedUrl(contentData.file_path, 300) // 5 minutes
          
        if (altUrlError) {
          console.error('Error generating signed URL with alternate path:', altUrlError)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to generate secure URL', 
              details: `Tried both ${filePath} and ${contentData.file_path}, errors: ${urlError.message}, ${altUrlError.message}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        console.log('Secure URL generated successfully using database file path')
        return new Response(
          JSON.stringify({ secureUrl: altUrlData.signedUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
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
      JSON.stringify({ error: 'Internal server error', details: error.message, stack: error.stack }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
