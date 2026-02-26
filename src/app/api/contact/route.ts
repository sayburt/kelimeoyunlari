import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, topic, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Gerekli alanlar eksik.' },
                { status: 400 }
            );
        }

        const data = await resend.emails.send({
            from: 'İletişim Formu <onboarding@resend.dev>', // Resend onaylı alan adı adresinizi buraya yazmalısınız (örneğin: iletisim@kelimeoyunlari.tr)
            to: ['ixirmedya@gmail.com'], // Gönderilecek (sizin) e-posta adresiniz
            replyTo: email,
            subject: `Kelime Oyunları: ${topic} (${name})`,
            html: `
                <h3>Kelime Oyunları - Yeni İletişim Mesajı</h3>
                <p><strong>İsim:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Konu:</strong> ${topic}</p>
                <hr />
                <p><strong>Mesaj:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
        });

        if (data.error) {
            console.error('Resend API Hatası:', data.error);
            return NextResponse.json(
                { error: 'E-posta gönderilirken bir hata oluştu.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('İletişim form hatası:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında beklenmeyen bir hata oluştu.' },
            { status: 500 }
        );
    }
}
