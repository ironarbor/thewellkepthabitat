import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Image as ImageIcon, PackageOpen, ShoppingBag, Sparkles } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Shop | The Well-Kept Habitat',
  description: 'Future TWKH field guides, books, editorial prints and habitat-inspired objects available without The Habitat Portrait.',
};

const shopPlans = [
  { icon: BookOpen, tag: 'Editorial collection', title: 'Field guides & books', text: 'Beautiful, practical resources for noticing habitat, choosing with care and returning to the garden season after season.' },
  { icon: ImageIcon, tag: 'Photography & art', title: 'Editorial prints', text: 'Non-custom images and art objects drawn from TWKH editorial work and available to every habitat-minded home.' },
  { icon: Sparkles, tag: 'Considered objects', title: 'Habitat goods', text: 'Useful and enduring objects designed to help observation, beauty and stewardship live in everyday practice.' },
];

export default function ShopPage() {
  return (
    <main>
      <SiteHeader current="shop" />
      <PageHero
        eyebrow="Shop · Future offering"
        title={<>Objects that help<br /><em>the story live on.</em></>}
        intro="The TWKH Shop will offer independently purchasable field guides, editorial prints and considered habitat goods. No assessment will be required."
        dark
      />

      <section className="shop-boundary-banner">
        <ShoppingBag size={29} />
        <div><p className="kicker">Available to everyone</p><h2>This is the independent Shop.</h2><p>Everything shown here is intended for purchase without The Habitat Portrait. Property-specific photographs and custom printed portraits remain Habitat Portrait add-ons under Services.</p></div>
        <a className="text-link" href="/services/habitat-assessments#assessment-addons">See Habitat Portrait add-ons <ArrowRight size={17} /></a>
      </section>

      <section className="shop-plans">
        <div className="section-title-block"><p className="eyebrow"><span /> In development</p><h2>The first collections.</h2><p>The Shop is part of TWKH’s long view. These categories show the intended direction while the core editorial and service offerings take root.</p></div>
        <div className="shop-grid">
          {shopPlans.map(({ icon: Icon, tag, title, text }, index) => <article key={title}><span className="product-number">0{index + 1}</span><Icon size={26} /><p className="product-tag">{tag}</p><h2>{title}</h2><p>{text}</p><span className="in-development">No assessment required · In development</span></article>)}
        </div>
      </section>

      <section className="shop-empty-state">
        <PackageOpen size={38} />
        <p className="kicker">Opening in a future season</p>
        <h2>The shelves are being considered carefully.</h2>
        <p>Follow TWKH for collection notes, product previews and opening announcements.</p>
        <a className="button button-forest" href="https://www.instagram.com/thewellkepthabitat/" target="_blank" rel="noreferrer">Follow on Instagram <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
