export type ShopFormat = 'digital';

export interface CatalogItem {
  id: string;
  artwork: string;
  title: string;
  format: ShopFormat;
  image: string;
  imageAlt: string;
  description: string;
  details: string;
  priceCents: number | null;
  editionReady: boolean;
}

const artworks = [
  {
    id: 'visit-to-the-hyssop',
    title: 'Bumbles Amongst Giants',
    image: '/images/bumblebee-blue-fortune-preview.jpg',
    imageAlt: 'A bumble bee with orange pollen visiting lavender hyssop flowers',
    description: 'A common eastern bumblebee visits purple giant hyssop.',
    details: 'The digital edition includes 4 × 6 and 5 × 7 inch landscape JPEGs, a one-page field note, and a printing guide. The bee is identified as a female worker Bombus impatiens; the plant is described as Agastache scrophulariifolia.',
  },
  {
    id: 'gold-and-ivory',
    title: 'Golden Everlasting',
    image: '/images/gold-and-ivory-photo.jpg',
    imageAlt: 'Yellow Canada goldenrod and white sweet everlasting flower clusters against a dark garden background',
    description: 'Canada goldenrod and sweet everlasting meet in a late-summer garden scene.',
    details: 'The digital edition includes 4 × 6 and 5 × 7 inch landscape JPEGs, a botanical field note about Canada goldenrod (Solidago canadensis) and sweet everlasting (Pseudognaphalium obtusifolium), and a printing guide.',
  },
] as const;

export const catalog: CatalogItem[] = artworks.map((art) => ({
    id: `${art.id}-digital`,
    artwork: art.id,
    title: art.title,
    format: 'digital' as const,
    image: art.image,
    imageAlt: art.imageAlt,
    description: art.description,
    details: `${art.details} Photography guarantee: No AI was used to create this photograph.`,
    priceCents: 400,
    editionReady: art.id === 'visit-to-the-hyssop' || art.id === 'gold-and-ivory',
}));
