import type { Metadata } from 'next';
import { ArrowRight, Brackets, CircleDot, Hexagon, Sprout } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'About TWKH | The Well-Kept Habitat',
  description: 'The mission, philosophy and long view behind The Well-Kept Habitat.',
};

const principles = [
  { icon: Brackets, title: 'Beauty + usefulness', text: 'Intentional composition can make a landscape coherent to the human eye while increasing its capacity to support life.' },
  { icon: CircleDot, title: 'Relationship creates habitat', text: 'Plants, insects, soil, water, people and place become habitat through what becomes possible among them.' },
  { icon: Sprout, title: 'Care scales outward', text: 'Plant within garden, garden within neighborhood, neighborhood within watershed: care at one scale participates in life at another.' },
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader current="about" />
      <PageHero
        eyebrow="About TWKH"
        title={<>Beauty can be<br /><em>an invitation to care.</em></>}
        intro="The Well-Kept Habitat creates, interprets and celebrates cultivated landscapes in which intentional beauty and ecological usefulness reinforce one another."
        image="/images/twkh-garden-hero.jpg"
        imageAlt="A cultivated New England habitat garden in warm light"
      />

      <section className="manifesto-section">
        <p className="section-index">The central idea</p>
        <div>
          <h2>A well-kept habitat is beauty arranged in service of life—and beauty used as an invitation to care.</h2>
          <p>TWKH does not propose one correct aesthetic for nature. A meadow, woodland edge, untended patch and formally composed native garden can all be thriving habitats. We focus on one particular opportunity: using thoughtful composition to make ecological value visible and inviting to people who may first be drawn in by beauty.</p>
        </div>
      </section>

      <section className="journey-band" aria-label="The human journey TWKH hopes to encourage">
        {['Attraction', 'Curiosity', 'Understanding', 'Appreciation', 'Stewardship'].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
      </section>

      <section className="principles-section">
        <div className="section-title-block">
          <p className="eyebrow"><span /> The philosophy</p>
          <h2>Structure can<br />create abundance.</h2>
        </div>
        <div className="principle-grid">
          {principles.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={27} /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="meaning-section">
        <div><p className="eyebrow light"><span /> What “well-kept” means</p><h2>Care made visible<br />through composition.</h2></div>
        <div className="meaning-columns">
          <div><h3>TWKH is</h3><p>Intentional · composed · ecologically useful · visually legible · invitational · relationship-centered · refined without being sterile.</p></div>
          <div><h3>TWKH is not</h3><p>A judgment against wildness, a prescription for what habitat must look like, or an attempt to make nature behave.</p></div>
        </div>
      </section>

      <section className="long-view-page">
        <div className="section-title-block">
          <p className="eyebrow"><span /> The long view</p>
          <h2>A living brand,<br />built to grow.</h2>
          <p>Editorial and Habitat Services are the work in focus now. Around them, TWKH is cultivating a wider ecosystem with patience and purpose.</p>
        </div>
        <div className="long-view-grid">
          <article><span>01</span><h3>Field guides & books</h3><p>Enduring editorial resources that turn the TWKH point of view into useful reference objects.</p></article>
          <article><span>02</span><h3>Habitat goods</h3><p>Considered objects that help observation, beauty and stewardship live beyond a single visit.</p></article>
          <article><span>03</span><h3>Learning in community</h3><p>Seasonal workshops, talks and conversations for homeowners and local organizations.</p></article>
          <article><span>04</span><h3>A mark of recognition</h3><p>A future standard celebrating landscapes where intentional beauty and ecological usefulness reinforce one another.</p></article>
        </div>
      </section>

      <section className="founder-bridge">
        <Hexagon size={34} />
        <div><p className="kicker">The person behind the work</p><h2>Meet the founder.</h2><p>TWKH joins strategy, careful observation and a Longmeadow resident’s relationship with cultivated habitat.</p></div>
        <a className="text-link" href="/about/founder-background">Founder background <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
