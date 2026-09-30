import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { ShopCatalog } from '@/components/shop-catalog';

export const metadata: Metadata = {
  title: 'Educational Artwork | The Well-Kept Habitat',
  description: 'Shop digital photographic artwork inspired by beautiful, ecologically useful gardens.',
};

export default function ShopPage() {
  return <main>
    <SiteHeader current="shop" />
    <section className="catalog-intro">
      <div><h1>The Well-Kept Habitat . Shop</h1><p>Photographic studies of the garden, offered as downloadable artwork. Choose a digital edition to bring a closer look home.</p></div>
    </section>
    <ShopCatalog />
    <section className="catalog-about"><p className="kicker">Good to know</p><div><h2>Beautiful to live with.<br /><em>Useful to learn from.</em></h2><p>Each digital edition includes a field note alongside two print-ready file sizes. Purchase one digital edition at a time.</p></div></section>
    <SiteFooter />
  </main>;
}
