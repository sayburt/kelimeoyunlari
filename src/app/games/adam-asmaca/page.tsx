import { Metadata } from 'next';
import { challengeService } from '@/services/challengeService';
import AdamAsmacaClient from './AdamAsmacaClient';

type Props = {
    searchParams: Promise<{ challengeId?: string }>
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const challengeId = resolvedParams.challengeId;

    if (challengeId) {
        const metadata = await challengeService.getChallengeMetadata(challengeId);
        if (metadata) {
            const title = `⚔️ ${metadata.creatorName} Sana Meydan Okuyor! | Adam Asmaca`;
            const description = `Adam Asmaca oyununda ${metadata.creatorName} sana meydan okuyor. Bu kapışmayı kabul et, bulmacayı çöz, sen de ona meydan oku.`;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    images: ['/games/adam-asmaca/og.jpg'],
                },
                twitter: {
                    title,
                    description,
                    images: ['/games/adam-asmaca/og.jpg'],
                }
            };
        }
    }

    return {};
}

export default function AdamAsmacaPage() {
    return <AdamAsmacaClient />;
}
