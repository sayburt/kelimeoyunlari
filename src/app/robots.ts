import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/ads.txt'],
                disallow: ['/api/', '/admin/', '/test-auth/'],
            },
        ],
        sitemap: 'https://www.kelimeoyunlari.tr/sitemap.xml',
    };
}
