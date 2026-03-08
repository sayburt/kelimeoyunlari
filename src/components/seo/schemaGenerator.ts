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

// ---------- pSEO Schemalari ----------

export interface ItemListSchemaData {
    name: string;
    description: string;
    url: string;
    items: string[];
    /** Maksimum schema'ya eklenecek item sayisi (varsayilan: 50) */
    maxItems?: number;
}

/**
 * pSEO kelime listesi sayfalari icin ItemList schema uretir.
 * Google SERP'te zengin sonuclar icin kullanilir.
 */
export function buildItemListSchema(data: ItemListSchemaData) {
    const maxItems = data.maxItems ?? 50;
    const displayItems = data.items.slice(0, maxItems);

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: data.name,
        description: data.description,
        url: `${SITE_URL}${data.url}`,
        numberOfItems: data.items.length,
        itemListElement: displayItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item,
        })),
    };
}

export interface FAQSchemaItem {
    question: string;
    answer: string;
}

/**
 * pSEO sayfalari icin FAQPage schema uretir.
 * Google SERP'te "Sik Sorulan Sorular" zengin sonucu gosterir.
 */
export function buildFAQSchema(items: FAQSchemaItem[]) {
    if (items.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}
