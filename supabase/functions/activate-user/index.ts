import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { token, password } = await req.json()

    console.log('Activate user request received', { token: token?.substring(0, 8) + '...' })

    if (!token || !password) {
      console.error('Missing token or password')
      return new Response(
        JSON.stringify({ error: 'Token e senha são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      console.error('Password too short')
      return new Response(
        JSON.stringify({ error: 'A senha deve ter no mínimo 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find profile by activation token
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('activation_token', token)
      .single()

    if (profileError || !profile) {
      console.error('Profile not found', profileError)
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Profile found', { email: profile.email, ativo: profile.ativo })

    // Check if token is expired
    if (profile.token_expires_at && new Date(profile.token_expires_at) < new Date()) {
      console.error('Token expired', { expires_at: profile.token_expires_at })
      return new Response(
        JSON.stringify({ error: 'Token expirado. Solicite um novo link de ativação.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is already activated
    if (profile.ativo && profile.id) {
      console.log('User already activated')
      return new Response(
        JSON.stringify({ error: 'Esta conta já foi ativada. Faça login.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: profile.email,
      password: password,
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating auth user', authError)
      
      // If user already exists, try to update password instead
      if (authError.message?.includes('already been registered')) {
        return new Response(
          JSON.stringify({ error: 'Este email já possui uma conta. Tente fazer login ou recuperar sua senha.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Erro ao criar conta: ' + authError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Auth user created', { userId: authData.user?.id })

    // Update profile: set ativo = true, link to auth user, clear token
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        id: authData.user?.id,
        ativo: true,
        activation_token: null,
        token_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', profile.email)

    if (updateError) {
      console.error('Error updating profile', updateError)
      // User was created but profile update failed - still consider it a success
      // The profile will be linked on next login
    }

    console.log('User activated successfully', { email: profile.email })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conta ativada com sucesso! Você já pode fazer login.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})