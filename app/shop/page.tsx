import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { ShopCatalog } from '@/components/shop-catalog';

export const metadata: Metadata = {
  title: 'Educational Artwork | The Well-Kept Habitat',
  description: 'Shop photographic artwork inspired by beautiful, ecologically useful gardens. Digital editions and physical prints.',
};

export default function ShopPage() {
  return <main>
    <SiteHeader current="shop" />
    <section className="catalog-intro">
      <div><h1>The Well-Kept Habitat . Shop</h1><p>Photographic studies of the garden, offered as downloadable artwork and planned physical prints. Choose a photograph, then the format that belongs in your space.</p></div>
    </section>
    <ShopCatalog />
    <section className="catalog-about"><p className="kicker">Good to know</p><div><h2>Beautiful to live with.<br /><em>Useful to learn from.</em></h2><p>Each digital edition includes a field note alongside two print-ready file sizes. Purchase one digital edition at a time. Physical prints will open after paper, sizes, production, and shipping costs are confirmed.</p></div></section>
    <SiteFooter />
  </main>;
}
