import {
    buildBreadcrumbSchema,
    buildFAQSchema,
    buildItemListSchema,
} from '@/components/seo/schemaGenerator';
import type { FAQItem } from './contentTemplates';
import type { WordEntry } from '@/lib/wordData';

interface BuildPseoSchemasParams {
    gameName: string;
    gameHref: string;
    displayTitle: string;
    canonicalPath: string;
    words: WordEntry[];
    description: string;
    faqItems: FAQItem[];
}

export function buildPseoSchemas(params: BuildPseoSchemasParams): Record<string, unknown>[] {
    const {
        gameName,
        gameHref,
        displayTitle,
        canonicalPath,
        words,
        description,
        faqItems,
    } = params;

    const schemas: Record<string, unknown>[] = [
        buildBreadcrumbSchema([
            { name: 'Anasayfa', item: '/' },
            { name: gameName, item: gameHref },
            { name: 'Kelime Listesi' },
            { name: displayTitle },
        ]),
        buildItemListSchema({
            name: displayTitle,
            description,
            url: canonicalPath,
            items: words.slice(0, 100).map((word) => word.kelime.toLocaleUpperCase('tr-TR')),
        }),
    ];

    const faqSchema = buildFAQSchema(faqItems);
    if (faqSchema) {
        schemas.push(faqSchema);
    }

    return schemas;
}
