import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'Digital Artwork Refund Policy | The Well-Kept Habitat',
  description: 'Delivery, access, and refund terms for TWKH digital artwork editions.',
};

export default function RefundPolicyPage() {
  return <main>
    <SiteHeader current="shop" />
    <article className="shop-policy">
      <p className="kicker">The Well-Kept Habitat · Digital editions</p>
      <h1>Delivery &amp; refund policy</h1>
      <p>Our digital editions are delivered as downloadable ZIP files. Each edition includes the photograph in two print sizes, a field note, and printing guidance. No physical item is shipped.</p>

      <h2>Delivery and access</h2>
      <p>After successful payment, your download is available from the order confirmation page and by a private link sent to the email address used at checkout. The link remains available for 30 days from purchase. Please save your files during that period. If the email or link does not arrive or work, contact us and we will help you access your purchase.</p>

      <h2>Refunds</h2>
      <p>Because access to the digital files is provided after payment, digital edition sales are final after delivery. We will review and refund a duplicate charge. If the file is missing, damaged, or materially different from its description, contact us so we can provide the correct file or a working link. If we cannot resolve the problem, we will issue a refund.</p>
      <p>These terms do not limit any rights you may have under applicable law. Any refund is returned to the original payment method through Stripe; the time it takes to appear depends on your payment provider.</p>

      <h2>Contact</h2>
      <p>Email <a href="mailto:admin@twkhabitat.com">admin@twkhabitat.com</a> with your order email and a brief description of the issue. You do not need to send us your payment card details.</p>
      <p><Link href="/shop">Return to the shop</Link></p>
    </article>
    <SiteFooter />
  </main>;
}
