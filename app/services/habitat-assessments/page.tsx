import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BookOpen, Camera, Check, LockKeyhole, Search } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Habitat Assessments | The Well-Kept Habitat',
  description: 'A diagnostic, evidence-informed portrait of your cultivated habitat, with structured observation, photography and a polished report.',
};

export default function HabitatAssessmentsPage() {
  return (
    <main>
      <SiteHeader current="services" />
      <PageHero
        eyebrow="Services · Habitat Assessments"
        title={<>See what is thriving.<br /><em>Understand what comes next.</em></>}
        intro="A thoughtful current-state review designed to give you agency, not anxiety—and a beautiful record of the habitat already taking shape."
        dark
      >
        <a className="button button-ivory" href="mailto:sc@ironarborllc.com?subject=Habitat%20Assessment%20interest">Ask about an assessment <ArrowRight size={17} /></a>
      </PageHero>

      <section className="assessment-overview">
        <div className="assessment-photo">
          <img src="/images/twkh-garden-hero.jpg" alt="Close view of native perennials in an intentionally composed habitat garden" />
          <div className="field-note note-one"><Search size={15} /><span>Observe what is already working</span></div>
          <div className="field-note note-two"><Camera size={15} /><span>Document the relationships</span></div>
        </div>
        <div className="assessment-copy">
          <p className="kicker">A portrait of your habitat today</p>
          <h2>Structured observation, interpreted with care.</h2>
          <p>A guided visit looks at the landscape as a living system—and at the human priorities, questions and possibilities within it.</p>
          <div className="assessment-includes">
            <p><Check size={16} /> 60–90 minute guided property visit</p>
            <p><Check size={16} /> Current strengths, concerns and habitat zones</p>
            <p><Check size={16} /> Prioritized opportunities and local resources</p>
            <p><Check size={16} /> Editorial photography within your digital report</p>
          </div>
          <p className="small-print">A diagnostic current-state review—not a landscape design, planting plan, formal certification or guarantee.</p>
        </div>
      </section>

      <section className="process-section">
        <div className="section-title-block"><p className="eyebrow"><span /> The assessment experience</p><h2>From your story<br />to a useful portrait.</h2></div>
        <div className="process-grid">
          <article><span>01</span><h3>Tell us your story</h3><p>A short inquiry about what you love, what you have planted and what wildlife you notice.</p></article>
          <article><span>02</span><h3>Look closer together</h3><p>An in-person visit combines structured observation with documentary garden photography.</p></article>
          <article><span>03</span><h3>Receive your habitat portrait</h3><p>A polished digital report captures findings, context, priorities and useful references.</p></article>
        </div>
      </section>

      <section className="assessment-addons" id="assessment-addons">
        <div className="addon-heading">
          <p className="eyebrow light"><span /> Assessment add-on products</p>
          <h2>Made from<br />your own habitat.</h2>
          <p>These optional products depend on the observation and photography completed during your Habitat Assessment. They are not available as standalone Shop purchases.</p>
        </div>
        <div className="addon-grid">
          <article><LockKeyhole size={22} /><span>Requires a Habitat Assessment</span><Camera size={30} /><h3>Expanded habitat photography collection</h3><p>A curated set of property-specific photographs extending beyond the images included in your assessment report.</p></article>
          <article><LockKeyhole size={22} /><span>Requires a Habitat Assessment</span><BookOpen size={30} /><h3>Custom printed habitat portrait</h3><p>A considered printed keepsake created from the story, findings and imagery of your own assessed landscape.</p></article>
        </div>
      </section>

      <section className="standalone-shop-note">
        <div><p className="kicker">Looking for something without an assessment?</p><h2>Visit the independent Shop.</h2><p>Future field guides, books, editorial prints and other habitat-inspired objects will be available to everyone—no assessment required.</p></div>
        <a className="button button-forest" href="/shop">Explore the Shop <ArrowRight size={17} /></a>
      </section>

      <section className="page-next-links">
        <a href="/services"><ArrowLeft size={17} /> All services</a>
        <a href="/services/consultations">Considering a consultation? <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
