import type { Metadata } from 'next';
import { ArrowRight, Camera, Check, MessageCircle, Search } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Habitat Services | The Well-Kept Habitat',
  description: 'The Habitat Portrait and consultations for New England homeowners who want to see their landscapes with new attention.',
};

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader current="services" />
      <PageHero
        eyebrow="Habitat Services"
        title={<>See your landscape<br /><em>with new attention.</em></>}
        intro="Consultations and The Habitat Portrait translate credible ecological observation into clear, beautiful and manageable homeowner agency."
        image="/images/twkh-garden-hero.jpg"
        imageAlt="Native perennials within a thoughtfully composed habitat garden"
      />

      <section className="service-choice" id="choose-service">
        <div className="section-title-block"><p className="eyebrow"><span /> Choose your starting point</p><h2>What kind of attention<br />would be most useful?</h2></div>
        <div className="service-choice-grid">
          <article className="service-choice-card dark-card">
            <span className="service-status">Foundational service · Local and in person</span>
            <Search size={31} />
            <h2>The Habitat Portrait</h2>
            <p>A structured, evidence-informed portrait of your property combining guided observation, photography and a polished TWKH report.</p>
            <ul><li><Check size={15} /> Best for understanding the landscape as a whole</li><li><Check size={15} /> Includes a property visit and written findings</li><li><Check size={15} /> Portrait-only add-ons available</li></ul>
            <a href="/services/habitat-assessments">Explore The Habitat Portrait <ArrowRight size={17} /></a>
          </article>
          <article className="service-choice-card light-card">
            <span className="service-status">Focused guidance · By inquiry</span>
            <MessageCircle size={31} />
            <h2>Habitat Consultations</h2>
            <p>A focused conversation for homeowners who want help understanding a habitat question, clarifying priorities or considering what to explore next.</p>
            <ul><li><Check size={15} /> Best for a defined question or decision</li><li><Check size={15} /> Conversational rather than comprehensive</li><li><Check size={15} /> A useful first step when you are unsure</li></ul>
            <a href="/services/consultations">Explore consultations <ArrowRight size={17} /></a>
          </article>
        </div>
      </section>

      <section className="service-boundary">
        <Camera size={27} />
        <div><p className="kicker">A clear product boundary</p><h2>Property-specific keepsakes belong to The Habitat Portrait journey.</h2><p>Photography collections and custom printed portraits created from your property are Habitat Portrait add-ons. Products anyone can purchase independently will live in the Shop.</p></div>
        <a className="text-link" href="/shop">See the independent Shop <ArrowRight size={17} /></a>
      </section>

      <section className="services-ethos">
        <p className="eyebrow light"><span /> The TWKH approach</p>
        <blockquote>Rigorous in method.<br /><em>Generous in spirit.</em></blockquote>
        <p>Every service begins with what is present and possible. The goal is a calmer, clearer relationship with the landscape—not a longer list of reasons to feel behind.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
