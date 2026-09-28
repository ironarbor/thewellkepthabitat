export type ShopFormat = 'digital' | 'print';

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
    title: 'A Visit to the Hyssop',
    image: '/images/bumblebee-blue-fortune-preview.jpg',
    imageAlt: 'A bumble bee with orange pollen visiting lavender hyssop flowers',
    description: 'A common eastern bumble bee visits Blue Fortune hyssop.',
    details: 'The digital edition includes 4 × 6 and 5 × 7 inch landscape JPEGs, a one-page field note, and a printing guide. The bee is identified as a female worker Bombus impatiens; the flower is Agastache “Blue Fortune”.',
  },
  {
    id: 'lavender-spires',
    title: 'Lavender Spires',
    image: '/images/lavender-spires-photo.jpg',
    imageAlt: 'A sunlit garden filled with tall lavender flower spikes',
    description: 'A summer stand of lavender flower spikes in the garden.',
    details: 'A second photograph in the educational artwork series. Species notes and downloadable print files are in preparation.',
  },
  {
    id: 'gold-and-ivory',
    title: 'Gold & Ivory',
    image: '/images/gold-and-ivory-photo.jpg',
    imageAlt: 'Yellow and white flower clusters against a dark garden background',
    description: 'Yellow and white blooms gathered in a quiet garden scene.',
    details: 'A third photograph in the educational artwork series. Species notes and downloadable print files are in preparation.',
  },
] as const;

export const catalog: CatalogItem[] = artworks.flatMap((art) => [
  {
    id: `${art.id}-digital`,
    artwork: art.id,
    title: art.title,
    format: 'digital' as const,
    image: art.image,
    imageAlt: art.imageAlt,
    description: art.description,
    details: art.details,
    priceCents: 400,
    editionReady: art.id === 'visit-to-the-hyssop',
  },
  {
    id: `${art.id}-print`,
    artwork: art.id,
    title: art.title,
    format: 'print' as const,
    image: art.image,
    imageAlt: art.imageAlt,
    description: art.description,
    details: 'A physical print of this photograph is planned. Paper, size, print price, production method, and shipping charge will be confirmed before orders open.',
    priceCents: null,
    editionReady: false,
  },
]);
