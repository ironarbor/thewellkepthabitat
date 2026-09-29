import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { ShopOrderStatus } from '@/components/shop-order-status';

export const metadata: Metadata = { title: 'Your Artwork | The Well-Kept Habitat', robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return <main><SiteHeader current="shop" /><section className="shop-confirmation"><p className="eyebrow"><span /> The Well-Kept Habitat · Your order</p><h1>Thank you for looking closer.</h1><ShopOrderStatus /></section><SiteFooter /></main>;
}
