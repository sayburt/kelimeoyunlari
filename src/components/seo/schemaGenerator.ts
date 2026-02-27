import { Game } from '@/data/games';

export const SITE_URL = 'https://www.kelimeoyunlari.tr';

export function buildWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Kelime Oyunları',
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/arama?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };
}

export function buildOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Kelime Oyunları',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
    };
}

export interface BreadcrumbItem {
    name: string;
    item?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: breadcrumb.name,
            ...(breadcrumb.item ? { item: `${SITE_URL}${breadcrumb.item}` } : {})
        }))
    };
}

export interface ArticleSchemaData {
    headline: string;
    description: string;
    image: string;
    url: string;
}

export function buildArticleSchema(data: ArticleSchemaData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        image: data.image,
        author: {
            '@type': 'Organization',
            name: 'Kelime Oyunları',
            url: SITE_URL
        },
        publisher: {
            '@type': 'Organization',
            name: 'Kelime Oyunları',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/icon.svg`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
        }
    };
}

export interface HowToStepData {
    name?: string;
    text: string;
    url?: string;
}

export function buildHowToSchema(name: string, description: string, steps: HowToStepData[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        step: steps.map((s) => ({
            '@type': 'HowToStep',
            ...(s.name ? { name: s.name } : {}),
            text: s.text,
            ...(s.url ? { url: s.url } : {})
        }))
    };
}

export function buildVideoGameSchema(game: Game) {
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.title,
        description: game.description,
        genre: ['Kelime Oyunu', 'Bulmaca'],
        url: `${SITE_URL}${game.href}`,
        image: `${SITE_URL}${game.thumbnail}`,
        inLanguage: 'tr',
        playMode: 'SinglePlayer',
        applicationCategory: 'Game',
        platform: 'WebBrowser',
    };
}
