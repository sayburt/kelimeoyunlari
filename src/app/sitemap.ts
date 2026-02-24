import { MetadataRoute } from 'next';
import { GAMES } from "@/data/games";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.kelimeoyunlari.tr';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/auth`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/games/wordle`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/nasil-oynanir`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...GAMES.filter(g => !g.comingSoon).map(game => ({
            url: `${baseUrl}/nasil-oynanir/${game.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))
    ];
}
