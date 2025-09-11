import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { password } = await req.json()

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password required for account deletion' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify password by attempting to sign in
    const { error: passwordError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: password
    })

    if (passwordError) {
      console.error('Password verification failed:', passwordError)
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Starting account deletion for user: ${user.id}`)

    // Delete all user data in correct order (respecting foreign key constraints)
    
    // 1. Delete pet note attachments and files from storage
    const { data: attachments } = await supabaseClient
      .from('pet_note_attachments')
      .select('file_path, note_id')
      .in('note_id', 
        supabaseClient
          .from('pet_notes')
          .select('id')
          .eq('user_id', user.id)
      )

    if (attachments && attachments.length > 0) {
      // Delete files from storage
      const filePaths = attachments.map(att => att.file_path)
      await supabaseClient.storage.from('Pet Attachments').remove(filePaths)
      console.log(`Deleted ${filePaths.length} attachment files from storage`)
    }

    // 2. Delete care programs for user's pets
    await supabaseClient
      .from('care_programs')
      .delete()
      .in('petid', 
        supabaseClient
          .from('pets')
          .select('id')
          .in('clientid',
            supabaseClient
              .from('clients')
              .select('id')
              .eq('user_id', user.id)
          )
      )

    // 3. Delete visits for user's clients
    await supabaseClient
      .from('visits')
      .delete()
      .in('clientid',
        supabaseClient
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
      )

    // 4. Delete pet note attachments
    await supabaseClient
      .from('pet_note_attachments')
      .delete()
      .in('note_id',
        supabaseClient
          .from('pet_notes')
          .select('id')
          .eq('user_id', user.id)
      )

    // 5. Delete pet notes
    await supabaseClient
      .from('pet_notes')
      .delete()
      .eq('user_id', user.id)

    // 6. Delete pets
    await supabaseClient
      .from('pets')
      .delete()
      .in('clientid',
        supabaseClient
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
      )

    // 7. Delete clients
    await supabaseClient
      .from('clients')
      .delete()
      .eq('user_id', user.id)

    // 8. Delete user subscriptions and addons
    await supabaseClient
      .from('user_addons')
      .delete()
      .eq('user_id', user.id)

    await supabaseClient
      .from('user_subscriptions')
      .delete()
      .eq('user_id', user.id)

    // 9. Delete specialist data
    await supabaseClient
      .from('specialist_specializations')
      .delete()
      .eq('specialist_id', user.id)

    // 10. Delete profile photo from storage if exists
    const { data: profile } = await supabaseClient
      .from('specialist_profiles')
      .select('photo_url')
      .eq('id', user.id)
      .single()

    if (profile?.photo_url) {
      const fileName = profile.photo_url.split('/').pop()
      if (fileName) {
        await supabaseClient.storage.from('profiles').remove([fileName])
        console.log('Deleted profile photo from storage')
      }
    }

    await supabaseClient
      .from('specialist_profiles')
      .delete()
      .eq('id', user.id)

    // 11. Delete user roles and profile
    await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', user.id)

    await supabaseClient
      .from('user_profiles')
      .delete()
      .eq('id', user.id)

    // 12. Finally, delete the user from auth
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id)
    
    if (deleteError) {
      console.error('Failed to delete user from auth:', deleteError)
      throw deleteError
    }

    // Log successful deletion (without personal data)
    console.log(`Successfully deleted account for user: ${user.id}`)

    return new Response(
      JSON.stringify({ message: 'Account successfully deleted' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error deleting account:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete account' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})