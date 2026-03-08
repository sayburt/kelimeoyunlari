import { MetadataRoute } from 'next';
import { GAMES } from "@/data/games";
import { getWordlePseoFilters } from '@/lib/wordData';
import { generateSlug } from '@/lib/pseo/slugGenerator';
import { PSEO_GAME_IDS } from '@/lib/pseo/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.kelimeoyunlari.tr';

    // --- Mevcut statik sayfalar ---
    const staticPages: MetadataRoute.Sitemap = [
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
            url: `${baseUrl}/games/boggle`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/games/kelime-arama`,
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
        {
            url: `${baseUrl}/sozluk/es-anlamli-kelimeler`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        },
        ...GAMES.filter(g => !g.comingSoon).map(game => ({
            url: `${baseUrl}/nasil-oynanir/${game.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        {
            url: `${baseUrl}/kvkk`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // --- pSEO sayfalari ---
    const pseoFilters = getWordlePseoFilters();
    const pseoGameIds = PSEO_GAME_IDS;

    const pseoPages: MetadataRoute.Sitemap = pseoGameIds.flatMap(gameId =>
        pseoFilters.map(filter => ({
            url: `${baseUrl}/games/${gameId}/p/${generateSlug(filter)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))
    );

    return [...staticPages, ...pseoPages];
}
