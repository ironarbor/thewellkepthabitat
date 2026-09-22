import { ArrowDownRight, ArrowRight, BookOpen, Leaf, MessageCircle, Search, ShoppingBag, Sprout } from 'lucide-react';
import { EditorialCover } from '@/components/editorial-cover';
import { SiteFooter, SiteHeader } from '@/components/site-shell';

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <img className="hero-image" src="/images/twkh-garden-hero.jpg" alt="A layered New England habitat garden with coneflowers, seedheads and a monarch butterfly" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light"><span /> Cultivating charm, ecological stewardship, and curiosity.</p>
          <h1>The Well-Kept<br />Habitat</h1>
          <p className="hero-intro">The Well-Kept Habitat explores what becomes possible when intentional elegance and ecological usefulness share the same ground.</p>
          <div className="hero-actions">
            <a className="button button-ivory" href="/editorial">Explore the editorial <BookOpen size={17} /></a>
            <a className="text-link light-link" href="/services">Discover habitat services <ArrowDownRight size={17} /></a>
          </div>
        </div>
        <div className="hero-note" aria-hidden="true"><Leaf size={17} /><span>Attraction</span><i /><span>Curiosity</span><i /><span>Stewardship</span></div>
      </section>

      <section className="home-intro">
        <p className="section-index">The work in focus</p>
        <div>
          <h2>Two ways to look closer.</h2>
          <p>TWKH brings local landscapes into view through place-rooted editorial storytelling and thoughtful services for the people who care for them.</p>
        </div>
      </section>

      <section className="pillar-grid" aria-label="Primary TWKH offerings">
        <article className="pillar-card editorial-pillar">
          <BookOpen size={28} aria-hidden="true" />
          <p className="kicker">Stories rooted in place.</p>
          <h2>Local Landscape<br />Editorial</h2>
          <p>A quarterly publication for Longmeadow homeowners—alive to the seasons, the people and the cultivated habitats close to home.</p>
          <a href="/editorial">Enter the editorial <ArrowRight size={17} /></a>
        </article>
        <article className="pillar-card services-pillar">
          <Search size={28} aria-hidden="true" />
          <p className="kicker">Attention made useful.</p>
          <h2>Habitat<br />Services</h2>
          <p>Consultations and The Habitat Portrait turn careful observation into clear, manageable agency for people and organizations who steward property.</p>
          <a href="/services">Explore services <ArrowRight size={17} /></a>
        </article>
      </section>

      <section className="philosophy-teaser">
        <div className="quote-seal" aria-hidden="true"><img src="/images/twkh-logo-seal-web.png" alt="" /></div>
        <div>
          <p className="eyebrow"><span /> About TWKH</p>
          <blockquote>“Elegance invites us closer; understanding gives us reason to care.”</blockquote>
          <p>TWKH uses intentional composition to help ecological usefulness become easier to see, appreciate and choose.</p>
          <a className="text-link" href="/about">Explore the philosophy <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="home-editorial-preview">
        <div className="editorial-preview-cover"><EditorialCover /></div>
        <div className="editorial-copy">
          <p className="kicker">First issue · Spring 2027</p>
          <h2>The Well-Kept Habitat — <em>Local Landscape Editorial</em></h2>
          <p>Garden portraits, seasonal ecology, native elegance and practical ideas with a strong sense of place.</p>
          <a className="text-link light-link" href="/editorial/issues-or-articles">Preview the first issue <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="future-paths">
        <div><p className="eyebrow"><span /> Growing from the work</p><h2>The long view,<br />held lightly.</h2></div>
        <div className="future-path-list">
          <a href="/shop"><ShoppingBag size={22} /><span><small>Future offering</small>Shop independent products</span><ArrowRight size={16} /></a>
          <a href="/learn"><Sprout size={22} /><span><small>Future offering</small>Learn in community</span><ArrowRight size={16} /></a>
          <a href="/services/consultations"><MessageCircle size={22} /><span><small>Available by inquiry</small>Start with a conversation</span><ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="final-cta compact-final-cta">
        <p className="eyebrow"><span /> Begin where you are</p>
        <h2>Look closer at the life<br />already taking shape.</h2>
        <div className="final-links">
          <a href="/services">Explore habitat services <ArrowRight size={18} /></a>
          <a href="/editorial">Follow the editorial <ArrowRight size={18} /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
