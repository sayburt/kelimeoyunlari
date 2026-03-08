interface PageDescriptionProps {
    description: string;
}

/**
 * pSEO sayfasinin ust kismindaki aciklama paragraf.
 * Thin content onlemi: Her sayfa benzersiz verilerle zenginlestirilmis
 * dinamik bir aciklama icerir.
 */
export function PageDescription({ description }: PageDescriptionProps) {
    return (
        <div className="p-5 rounded-2xl bg-surface/5 border border-surface/10">
            <p className="text-text-muted leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
