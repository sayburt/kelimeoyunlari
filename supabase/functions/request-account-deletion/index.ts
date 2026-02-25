import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SITE_URL = Deno.env.get('SITE_URL') || 'https://kelimeoyunlari.com'

serve(async (req: Request) => {
    try {
        const supabaseClient = createClient(
            SUPABASE_URL!,
            SUPABASE_SERVICE_ROLE_KEY!
        )

        // Get user from JWT
        const authHeader = req.headers.get('Authorization')!
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Generate deletion token
        const deletionToken = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

        // Save to database
        const { error: dbError } = await supabaseClient
            .from('account_deletion_requests')
            .insert({
                user_id: user.id,
                token: deletionToken,
                expires_at: expiresAt.toISOString(),
            })

        if (dbError) throw dbError

        // Send email via Resend
        if (RESEND_API_KEY) {
            const confirmLink = `${SITE_URL}/confirm-delete?token=${deletionToken}`

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'Kelime Oyunları <noreply@kelimeoyunlari.com>',
                    to: user.email,
                    subject: 'Hesap Silme Onayı',
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #22d3ee;">Hesap Silme Talebi</h1>
              <p>Merhaba,</p>
              <p>Kelime Oyunları hesabınızı silmek için bir talepte bulundunuz. Eğer bu işlemi siz yapmadıysanız bu e-postayı dikkate almayın.</p>
              <p>Hesabınızı kalıcı olarak silmek için aşağıdaki butona tıklayın. Bu link 1 saat içinde geçerliliğini yitirecektir.</p>
              <div style="margin: 30px 0;">
                <a href="${confirmLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Hesabımı Kalıcı Olarak Sil</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">Not: Bu işlem geri alınamaz. Tüm oyun istatistikleriniz ve başarımlarınız silinecektir.</p>
            </div>
          `,
                }),
            })

            if (!res.ok) {
                const emailError = await res.json()
                console.error('Email sending failed:', emailError)
                // We still return success if the record was created, but log the error
            }
        } else {
            console.warn('RESEND_API_KEY is not set. Email not sent. Token:', deletionToken)
        }

        return new Response(JSON.stringify({ message: 'Success' }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
