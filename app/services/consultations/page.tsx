import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Compass, MessageCircle, Search } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Habitat Consultations | The Well-Kept Habitat',
  description: 'Focused habitat conversations for New England property stewards with a question, choice or next step to clarify.',
};

export default function ConsultationsPage() {
  return (
    <main>
      <SiteHeader current="services" />
      <PageHero
        eyebrow="Services · Consultations"
        title={<>Start with<br /><em>a thoughtful conversation.</em></>}
        intro="A focused consultation can help you understand a habitat question, clarify priorities or decide what kind of support would be most useful next."
        image="/images/twkh-garden-hero.jpg"
        imageAlt="A New England habitat garden with a stone path"
      >
        <a className="button button-ivory" href="mailto:sc@ironarborllc.com?subject=Habitat%20Consultation%20interest">Start an inquiry <ArrowRight size={17} /></a>
      </PageHero>

      <section className="consultation-fit">
        <div className="section-title-block"><p className="eyebrow"><span /> A focused starting point</p><h2>A consultation may fit<br />when you want to…</h2></div>
        <div className="fit-list">
          <article><Check size={18} /><p>Talk through a particular habitat question or landscape concern.</p></article>
          <article><Check size={18} /><p>Clarify priorities before investing more time or resources.</p></article>
          <article><Check size={18} /><p>Understand whether The Habitat Portrait is the right next step.</p></article>
          <article><Check size={18} /><p>Explore a community talk, workshop or editorial collaboration.</p></article>
        </div>
      </section>

      <section className="consultation-compare">
        <article><MessageCircle size={28} /><p className="kicker">Consultation</p><h2>Focused</h2><p>A conversation organized around a defined question, decision or opportunity.</p></article>
        <article><Search size={28} /><p className="kicker">The Habitat Portrait</p><h2>Comprehensive</h2><p>An evidence-informed, current-state landscape assessment for homes, campuses, and other stewarded properties.</p><a href="/services/habitat-assessments">Explore The Habitat Portrait <ArrowRight size={16} /></a></article>
      </section>

      <section className="inquiry-section">
        <Compass size={30} />
        <div><p className="eyebrow light"><span /> Not sure where to begin?</p><h2>Describe what you are noticing.</h2><p>You do not need to diagnose the problem—or know which service to ask for. A short note about your landscape and what you hope to understand is enough.</p></div>
        <a className="button button-ivory" href="mailto:sc@ironarborllc.com?subject=TWKH%20service%20inquiry">Start a conversation <ArrowRight size={17} /></a>
      </section>

      <section className="page-next-links">
        <a href="/services"><ArrowLeft size={17} /> All services</a>
        <a href="/services/habitat-assessments">The Habitat Portrait <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
