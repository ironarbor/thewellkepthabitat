import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, GraduationCap, MapPin, Sprout } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Founder Background | The Well-Kept Habitat',
  description: 'Meet Shekeyla Sandore, founder and principal of The Well-Kept Habitat.',
};

export default function FounderBackgroundPage() {
  return (
    <main>
      <SiteHeader current="about" />
      <PageHero
        eyebrow="About TWKH · Founder Background"
        title={<>Shekeyla Sandore,<br /><em>Founder & Principal.</em></>}
        intro="A strategist, advisor and Longmeadow resident bringing systems thinking and a deep attention to place to The Well-Kept Habitat."
        dark
      />

      <section className="founder-story">
        <aside>
          <img src="/images/twkh-logo-seal-web.png" alt="The Well-Kept Habitat seal" />
          <p>Founder and Principal<br />The Well-Kept Habitat</p>
        </aside>
        <div>
          <p className="lead-copy">The Well-Kept Habitat grows from Shekeyla’s belief that thoughtful structure can help more people recognize and participate in the living systems around them.</p>
          <p>Her professional background spans strategy, operating-model design, institutional investment and advisory work. Before founding TWKH, her experience included Boston Consulting Group and Wellington Management. She is also the founder of Iron Arbor Advisory, a fixed-fee strategic advisory practice.</p>
          <p>That discipline of looking carefully—at systems, relationships, incentives and what becomes possible among separate parts—now informs TWKH’s approach to cultivated habitat.</p>
        </div>
      </section>

      <section className="background-grid">
        <article><BriefcaseBusiness size={25} /><p className="kicker">Experience</p><h2>Strategy & stewardship</h2><p>Work across digital transformation, operating-model design, institutional multi-asset strategy and consultant relations.</p></article>
        <article><GraduationCap size={25} /><p className="kicker">Education</p><h2>Grounded inquiry</h2><p>MBA, Harvard Business School; BA cum laude, Brandeis University, with coursework at the London School of Economics.</p></article>
        <article><MapPin size={25} /><p className="kicker">Place</p><h2>Longmeadow, Massachusetts</h2><p>TWKH begins locally—with the gardens, seasons, neighborhoods and questions of the community its founder calls home.</p></article>
        <article><Sprout size={25} /><p className="kicker">Community</p><h2>Participation beyond the garden</h2><p>Board and advisory experience includes Pioneer Valley Montessori School and the Takeoff Institute fellowship program.</p></article>
      </section>

      <section className="founder-quote">
        <blockquote>“The deeper idea is one nature demonstrates repeatedly: function can be beautiful, structure can create abundance, and small acts can matter beyond their boundaries.”</blockquote>
      </section>

      <section className="page-next-links">
        <a href="/about"><ArrowLeft size={17} /> Return to About TWKH</a>
        <a href="/services">Explore Habitat Services <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
