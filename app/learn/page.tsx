import type { Metadata } from 'next';
import { ArrowRight, BookOpen, MessageCircle, Sprout, Users } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Learn | The Well-Kept Habitat',
  description: 'Future TWKH workshops, talks and editorial field notes for homeowners and community organizations.',
};

export default function LearnPage() {
  return (
    <main>
      <SiteHeader current="learn" />
      <PageHero
        eyebrow="Learn · Future offering"
        title={<>Curiosity,<br /><em>shared outward.</em></>}
        intro="Future learning experiences will make ecological usefulness easier to see, appreciate and choose—without prescribing a single way for habitat to look."
        image="/images/twkh-garden-hero.jpg"
        imageAlt="A layered garden supporting flowers, seedheads and wildlife"
      />

      <section className="learning-paths">
        <div className="section-title-block"><p className="eyebrow"><span /> Learning in community</p><h2>Notice more.<br />Understand more.<br />Care with confidence.</h2></div>
        <div className="learning-card-grid">
          <article><Sprout size={27} /><span>01</span><h2>Seasonal workshops</h2><p>Hands-on, place-aware sessions for homeowners and small groups, organized around what the season makes visible.</p><span className="coming-label">In development</span></article>
          <article><Users size={27} /><span>02</span><h2>Garden club & community talks</h2><p>Thoughtful conversations about native plants, cultivated habitat and stewardship for local organizations.</p><span className="coming-label">By inquiry</span></article>
          <article><BookOpen size={27} /><span>03</span><h2>Editorial field notes</h2><p>Short observations and practical ideas that extend the Local Landscape Editorial between issues.</p><span className="coming-label">Planned</span></article>
        </div>
      </section>

      <section className="learning-philosophy">
        <p className="eyebrow light"><span /> The learning philosophy</p>
        <blockquote>Beauty draws attention. Attention creates curiosity. Curiosity can become understanding—and stewardship.</blockquote>
      </section>

      <section className="learning-inquiry">
        <MessageCircle size={29} />
        <div><p className="kicker">For garden clubs & community organizations</p><h2>Planning a future gathering?</h2><p>Tell TWKH about your audience, setting and the habitat questions you hope to explore together.</p></div>
        <a className="button button-forest" href="mailto:sc@ironarborllc.com?subject=TWKH%20learning%20or%20talk%20inquiry">Start an inquiry <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
