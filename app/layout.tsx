import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const sans = Manrope({
  variable: '--font-sans-custom',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wellkepthabitat.com'),
  title: 'The Well-Kept Habitat | Local Landscape Editorial & Services',
  description: 'The Well-Kept Habitat explores cultivated landscapes through a local landscape editorial, consultations and evidence-informed habitat assessments in New England.',
  openGraph: {
    title: 'The Well-Kept Habitat',
    description: 'Local Landscape Editorial & Habitat Services',
    images: [{ url: '/og.jpg', width: 900, height: 472, alt: 'The Well-Kept Habitat — Local Landscape Editorial & Habitat Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Well-Kept Habitat',
    description: 'Local Landscape Editorial & Habitat Services',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
