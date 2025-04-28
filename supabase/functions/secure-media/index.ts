
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
    } catch (e: any) {
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
      .select('id, file_path, creator_id')
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
    
    // If user is the creator, allow access directly without transaction check
    if (contentData.creator_id === user.id) {
      console.log(`User is the creator, granting direct access`)
      
      try {
        // Check if storage bucket exists first to prevent errors
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
        
        // Check if content-media bucket exists
        const contentMediaBucket = buckets.find(b => b.name === 'content-media');
        if (!contentMediaBucket) {
          console.error('Storage bucket "content-media" not found')
          return new Response(
            JSON.stringify({ 
              error: 'Storage configuration error: bucket not found',
              details: 'The content-media bucket does not exist. Please create it in the Supabase dashboard.'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        // Try creating signed URL with the requested file path
        try {
          const { data: urlData, error: urlError } = await supabaseClient
            .storage
            .from('content-media')
            .createSignedUrl(filePath, 600) // 10 minutes
            
          if (!urlError) {
            console.log('Secure URL generated successfully for creator')
            return new Response(
              JSON.stringify({ secureUrl: urlData.signedUrl }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          
          console.error('Error with requested path, trying database path')
          
          // If that fails and database path is different, try with the database path
          if (contentData.file_path && contentData.file_path !== filePath) {
            const { data: altUrlData, error: altUrlError } = await supabaseClient
              .storage
              .from('content-media')
              .createSignedUrl(contentData.file_path, 600) // 10 minutes
            
            if (!altUrlError) {
              console.log('Secure URL generated with database path for creator')
              return new Response(
                JSON.stringify({ secureUrl: altUrlData.signedUrl }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
            
            console.error('Both paths failed:', urlError, altUrlError)
          }
        } catch (e) {
          console.error('Error creating signed URL:', e)
        }
      } catch (e) {
        console.error('Error in creator file access:', e)
      }
      
      // If we got here, all attempts failed
      return new Response(
        JSON.stringify({ 
          error: 'File access error', 
          details: 'Unable to generate secure URL. The file may not exist or there may be a permissions issue.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // For non-creators, check if they have purchased the content
    console.log(`Checking if user ${user.id} has purchased content ${contentId}`)
    try {
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
        
        // Double-check by directly querying transactions as a fallback
        const { data: transactions, error: txError } = await supabaseClient
          .from('transactions')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .limit(1);
          
        if (txError) {
          console.error("Transaction fallback check failed:", txError)
          return new Response(
            JSON.stringify({ error: 'Access denied to content' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          )
        }
        
        // If no transactions found, definitely deny access
        if (!transactions || transactions.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Access denied to content' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          )
        }
        
        // Transaction found but RPC failed - probably a timing issue, allow access
        console.log('RPC denied but transaction found - allowing access as fallback')
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
      
      // Try creating signed URL with the requested file path first
      try {
        const { data: urlData, error: urlError } = await supabaseClient
          .storage
          .from('content-media')
          .createSignedUrl(filePath, 600) // 10 minutes
          
        if (!urlError) {
          console.log('Secure URL generated successfully')
          return new Response(
            JSON.stringify({ secureUrl: urlData.signedUrl }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        console.error('Error with requested path, trying database path')
        
        // If that fails and database path is different, try with the database path
        if (contentData.file_path && contentData.file_path !== filePath) {
          const { data: altUrlData, error: altUrlError } = await supabaseClient
            .storage
            .from('content-media')
            .createSignedUrl(contentData.file_path, 600) // 10 minutes
          
          if (!altUrlError) {
            console.log('Secure URL generated with database path')
            return new Response(
              JSON.stringify({ secureUrl: altUrlData.signedUrl }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          
          console.error('Both paths failed:', urlError, altUrlError)
          return new Response(
            JSON.stringify({ 
              error: 'File not found', 
              details: `Tried both ${filePath} and ${contentData.file_path}, but neither exists in storage.` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          )
        } else {
          // Only one path was tried
          console.error('File not found in storage:', urlError)
          return new Response(
            JSON.stringify({ error: 'File not found', details: urlError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          )
        }
      } catch (e: any) {
        console.error('Error creating signed URL:', e)
        return new Response(
          JSON.stringify({ error: 'Failed to generate secure URL', details: e.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    } catch (e: any) {
      console.error('Error in permission check:', e)
      return new Response(
        JSON.stringify({ error: 'Permission check failed', details: e.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Unexpected error in secure-media function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
