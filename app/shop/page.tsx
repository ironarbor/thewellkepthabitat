import type { Metadata } from 'next';
import { ArrowRight, Download, Flower2, Package } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { ShopCheckoutButton } from '@/components/shop-checkout-button';

export const metadata: Metadata = {
  title: 'Educational Artwork | The Well-Kept Habitat',
  description: 'Photographic artwork that pairs the beauty of a garden with a closer look at the life within it.',
};

export default function ShopPage() {
  return (
    <main>
      <SiteHeader current="shop" />
      <section className="art-shop-intro">
        <p className="eyebrow"><span /> The Well-Kept Habitat · Shop</p>
        <h1>Art for <em>looking closer.</em></h1>
        <p>Photographs of the encounters that make a garden feel alive. Each digital edition pairs an image for the wall with a brief field note about what you are seeing.</p>
      </section>

      <section className="art-product" aria-labelledby="art-product-title">
        <div className="art-product-image">
          <img src="/images/bumblebee-blue-fortune-preview.jpg" alt="A bumble bee with orange pollen on its hind leg visits lavender Agastache flowers" />
          <span>Photographed by Shekeyla Sandore</span>
        </div>
        <div className="art-product-details">
          <p className="kicker">01 / Educational artwork · Digital edition</p>
          <h2 id="art-product-title">A Visit to the Hyssop</h2>
          <p className="art-product-lead">A bumble bee pauses at the lavender spires of <i>Agastache</i> ‘Blue Fortune’, its pollen basket carrying the bright trace of another visit.</p>
          <div className="art-product-observation"><Flower2 size={21} aria-hidden="true" /><p><strong>A closer look</strong><br />The orange patch on the bee’s hind leg is a gathered load of pollen. ‘Blue Fortune’ is a cultivated hybrid in the mint family; it should not be confused with the species commonly called anise hyssop, <i>Agastache foeniculum</i>.</p></div>
          <div className="art-product-format"><Download size={20} aria-hidden="true" /><div><strong>Instant download</strong><span>Landscape photograph in 4 × 6 and 5 × 7 inch print sizes, plus a one-page field note and printing guide. For personal display or a physical gift.</span></div></div>
          <ShopCheckoutButton />
          <p className="art-product-fine-print">Digital files only; no physical print will be shipped. Please keep the files for your own use. The launch price will appear here before sales open.</p>
        </div>
      </section>

      <section className="art-shop-next">
        <div><p className="kicker">Coming next</p><h2>Made for the wall, sent to your door.</h2><p>Physical fine-art prints are being sampled. Paper, dimensions, packaging, and delivery details will be published once the finished work has been reviewed.</p></div>
        <Package size={38} aria-hidden="true" />
      </section>
      <section className="art-shop-source"><p><strong>Field-note references</strong> · <a href="https://plants.ces.ncsu.edu/plants/agastache-blue-fortune/" target="_blank" rel="noreferrer">NC State Extension on ‘Blue Fortune’ <ArrowRight size={13} aria-hidden="true" /></a> · <a href="https://extension.umn.edu/gardening-minnesota/edible-flowers" target="_blank" rel="noreferrer">UMN Extension on anise hyssop <ArrowRight size={13} aria-hidden="true" /></a></p></section>
      <SiteFooter />
    </main>
  );
}
