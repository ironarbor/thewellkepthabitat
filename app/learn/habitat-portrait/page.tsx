import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft, BookOpen, Camera, FileText, Search } from 'lucide-react';
import { HabitatPortraitForm } from '@/components/habitat-portrait-form';
import { SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'The Habitat Portrait — Complete Example | The Well-Kept Habitat',
  description: 'Download a complete example of The Habitat Portrait, an evidence-informed current-state landscape assessment.',
  robots: { index: true, follow: true },
};

export default function HabitatPortraitPreviewPage() {
  return (
    <main>
      <SiteHeader current="learn" />
      <section className="portrait-download-hero">
        <div className="portrait-preview-panel">
          <div className="portrait-cover-frame">
            <Image
              src="/images/habitat-portrait-cover.jpg"
              alt="Cover of The Habitat Portrait for a property on Viscount Road"
              width={991}
              height={1403}
              priority
            />
          </div>
          <div className="portrait-preview-copy">
            <p className="eyebrow light"><span /> A complete example · 17 pages</p>
            <h1>See what a landscape reveals when you look closely.</h1>
            <p>
              Explore a complete example of The Habitat Portrait—an evidence-informed environmental profile of a cultivated Longmeadow habitat.
            </p>
            <div className="portrait-preview-features">
              <p><Search size={17} /> A structured five-part assessment framework</p>
              <p><Camera size={17} /> Observations, photographs and habitat signals</p>
              <p><FileText size={17} /> Findings, context and reference sources</p>
            </div>
            <p className="portrait-working-note"><BookOpen size={15} /> This complete example shows the structure and depth of The Habitat Portrait service.</p>
          </div>
        </div>
        <HabitatPortraitForm />
      </section>

      <section className="portrait-next-step">
        <div>
          <p className="kicker">A portrait of your own habitat</p>
          <h2>Ready to understand what is thriving—and what could come next?</h2>
        </div>
        <a href="/services/habitat-assessments">Explore The Habitat Portrait service</a>
      </section>

      <section className="page-next-links">
        <a href="/learn"><ArrowLeft size={17} /> Back to Learning</a>
      </section>
      <SiteFooter />
    </main>
  );
}
