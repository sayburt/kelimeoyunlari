import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { token } = await req.json()

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const supabaseClient = createClient(
            SUPABASE_URL!,
            SUPABASE_SERVICE_ROLE_KEY!
        )

        // Find the request
        const { data: request, error: fetchError } = await supabaseClient
            .from('account_deletion_requests')
            .select('user_id, expires_at')
            .eq('token', token)
            .single()

        if (fetchError || !request) {
            return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Check expiry
        if (new Date(request.expires_at) < new Date()) {
            // Clean up expired request
            await supabaseClient.from('account_deletion_requests').delete().eq('token', token)

            return new Response(JSON.stringify({ error: 'Token has expired' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Delete the user (auth.admin allows deleting users from Edge Functions with service role)
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(request.user_id)

        if (deleteError) {
            console.error('User deletion failed:', deleteError)
            throw deleteError
        }

        // Records in other tables should be deleted due to ON DELETE CASCADE 
        // but the request record itself won't be if it's not linked correctly or if we want to be sure
        await supabaseClient.from('account_deletion_requests').delete().eq('token', token)

        return new Response(JSON.stringify({ message: 'Account successfully deleted' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})

