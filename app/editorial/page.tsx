import type { Metadata } from 'next';
import { ArrowRight, BookOpen, CalendarDays, Camera, MapPin, Sprout } from 'lucide-react';
import { EditorialCover } from '@/components/editorial-cover';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Local Landscape Editorial | The Well-Kept Habitat',
  description: 'The Well-Kept Habitat — Local Landscape Editorial, a quarterly publication rooted in Longmeadow.',
};

const editorialLenses = [
  { icon: Camera, title: 'Garden portraits', text: 'Local landscapes and the people whose attention, choices and care shape them.' },
  { icon: CalendarDays, title: 'Seasonal ecology', text: 'What is happening now—and what the changing season makes possible next.' },
  { icon: Sprout, title: 'Native beauty', text: 'Plants, compositions and relationships that are both refined and useful to life.' },
  { icon: MapPin, title: 'A sense of place', text: 'Practical ideas grounded in Longmeadow and the wider New England landscape.' },
];

export default function EditorialPage() {
  return (
    <main>
      <SiteHeader current="editorial" />
      <PageHero
        eyebrow="Editorial · In development"
        title={<>The Well-Kept Habitat —<br /><em>Local Landscape Editorial.</em></>}
        intro="A quarterly publication envisioned for Longmeadow homeowners—rooted in place, alive to the seasons and attentive to the beauty already growing close to home."
        dark
      >
        <a className="button button-ivory" href="/editorial/issues-or-articles">Explore issues & articles <ArrowRight size={17} /></a>
      </PageHero>

      <section className="editorial-main-feature">
        <div><EditorialCover /></div>
        <div className="editorial-copy light-editorial-copy">
          <p className="kicker">First issue · Spring 2027</p>
          <h2>A field guide to the life within the landscape.</h2>
          <p>TWKH is a local editorial about cultivated habitats, the people who tend them and the relationships that make a neighborhood more alive.</p>
          <p className="editorial-status"><i /> First issue in development</p>
          <a className="text-link" href="mailto:sc@ironarborllc.com?subject=TWKH%20Local%20Landscape%20Editorial%20interest">Join the first-issue list <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="editorial-lenses">
        <div className="section-title-block"><p className="eyebrow"><span /> What you will find</p><h2>Stories that begin<br />close to home.</h2></div>
        <div className="lens-grid">
          {editorialLenses.map(({ icon: Icon, title, text }, index) => <article key={title}><span>0{index + 1}</span><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="editorial-purpose">
        <BookOpen size={30} />
        <blockquote>Local enough to recognize. Beautiful enough to keep. Useful enough to change what happens next.</blockquote>
        <p>The editorial is envisioned as a recurring invitation to notice more, understand more and tend with greater confidence.</p>
      </section>

      <section className="page-next-links solo-next-link">
        <a href="/editorial/issues-or-articles">Browse the issue preview <ArrowRight size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
