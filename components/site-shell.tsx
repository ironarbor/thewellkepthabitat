import { ArrowRight, MapPin, Menu } from 'lucide-react';

const navigation = [
  { label: 'About TWKH', href: '/about', key: 'about' },
  { label: 'Editorial', href: '/editorial', key: 'editorial' },
  { label: 'Services', href: '/services', key: 'services' },
  { label: 'Shop', href: '/shop', key: 'shop' },
  { label: 'Learn', href: '/learn', key: 'learn' },
];

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="The Well-Kept Habitat home">
        <span className="brand-mark" aria-hidden="true">TWKH</span>
        <span className="brand-name">The Well-Kept Habitat</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <a className={current === item.key ? 'active' : ''} href={item.href} key={item.key}>{item.label}</a>)}
      </nav>
      <a className="header-cta" href="/services#choose-service">Book a service <ArrowRight size={15} aria-hidden="true" /></a>
      <details className="mobile-menu">
        <summary aria-label="Open navigation"><Menu size={20} aria-hidden="true" /></summary>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <a className={current === item.key ? 'active' : ''} href={item.href} key={item.key}>{item.label}</a>)}
          <a href="/services#choose-service">Book a service</a>
        </nav>
      </details>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><span>TWKH</span><p>The Well-Kept Habitat</p></div>
      <div>
        <p className="footer-mission">Cultivating beauty, curiosity and ecological stewardship in New England.</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          {navigation.map((item) => <a href={item.href} key={item.key}>{item.label}</a>)}
        </nav>
        <div className="social-links" aria-label="Social media">
          <a href="https://www.instagram.com/thewellkepthabitat/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#" title="Facebook link coming soon" aria-label="Facebook link coming soon">Facebook</a>
          <a href="#" title="YouTube link coming soon" aria-label="YouTube link coming soon">YouTube</a>
        </div>
      </div>
      <div className="footer-meta"><p><MapPin size={14} /> Longmeadow, Massachusetts</p><a href="mailto:sc@ironarborllc.com">sc@ironarborllc.com</a><p>© 2026 The Well-Kept Habitat</p></div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro, image, imageAlt, dark = false, children }: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image?: string;
  imageAlt?: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${image ? ' image-page-hero' : ''}${dark ? ' dark-page-hero' : ''}`}>
      {image && <><img src={image} alt={imageAlt ?? ''} /><div className="page-hero-shade" /></>}
      <div className="page-hero-content">
        <p className={`eyebrow${image || dark ? ' light' : ''}`}><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children && <div className="page-hero-actions">{children}</div>}
      </div>
    </section>
  );
}
