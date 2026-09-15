import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { PageHero, SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Issues & Articles | The Well-Kept Habitat',
  description: 'Preview forthcoming issues and articles from The Well-Kept Habitat — Local Landscape Editorial.',
};

const issueStories = [
  { type: 'Garden practice', title: 'Rooted in Place', text: 'Designing ecological gardens that thrive in Longmeadow.' },
  { type: 'Plant perspective', title: 'Native Elegance', text: 'The sophisticated elegance of native plants in every season.' },
  { type: 'Garden portrait', title: 'Local Gardens', text: 'Inspiration from the home landscapes of our community.' },
  { type: 'Seasonal guide', title: 'A More Useful Autumn', text: 'Planting and tending for pollinators, wildlife and enduring elegance.' },
];

export default function IssuesArticlesPage() {
  return (
    <main>
      <SiteHeader current="editorial" />
      <PageHero
        eyebrow="Editorial · Issues & Articles"
        title={<>The first stories<br /><em>are taking root.</em></>}
        intro="The Spring 2027 issue is in development. This preview introduces the editorial lenses and stories planned for the first volume."
        image="/images/twkh-garden-hero.jpg"
        imageAlt="A garden path through a layered habitat garden"
      />

      <section className="issue-overview">
        <div className="issue-meta"><span>Spring 2027</span><span>Volume 1 · Issue 1</span><span>Longmeadow, Massachusetts</span></div>
        <div className="issue-title"><p className="kicker">Forthcoming</p><h2>Rooted in place.</h2><p>A quarterly collection of local garden portraits, seasonal ecology, native elegance and practical ideas that help ecological usefulness feel visible and within reach.</p></div>
      </section>

      <section className="story-preview-grid">
        {issueStories.map((story, index) => <article key={story.title}><span className="story-number">0{index + 1}</span><p className="kicker">{story.type}</p><h2>{story.title}</h2><p>{story.text}</p><span className="coming-label">Planned for Issue 1</span></article>)}
      </section>

      <section className="editorial-callout">
        <CalendarDays size={27} />
        <div><p className="kicker">Publication status</p><h2>First issue planned for Spring 2027.</h2><p>Join the first-issue list to follow the editorial as reporting, photography and community stories come together.</p></div>
        <a className="button button-forest" href="mailto:sc@ironarborllc.com?subject=TWKH%20Local%20Landscape%20Editorial%20interest">Join the list <ArrowRight size={17} /></a>
      </section>

      <section className="page-next-links">
        <a href="/editorial"><ArrowLeft size={17} /> Editorial overview</a>
        <a href="/about">The philosophy behind TWKH <BookOpen size={17} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
