'use client';

import { useEffect, useState } from 'react';

export function ShopOrderStatus() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<'waiting' | 'ready' | 'missing'>('waiting');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) { setState('missing'); return; }
    let active = true;
    let attempts = 0;
    async function check() {
      try {
        const response = await fetch(`/api/shop/order?session_id=${encodeURIComponent(sessionId!)}`, { cache: 'no-store' });
        const result = await response.json() as { status: string; downloadUrl?: string; expiresAt?: string };
        if (!active) return;
        if (result.status === 'ready' && result.downloadUrl) {
          setUrl(result.downloadUrl);
          if (result.expiresAt) setExpiresAt(result.expiresAt);
          setState('ready');
        } else if (++attempts < 12) {
          window.setTimeout(check, 2500);
        }
      } catch {
        if (active && ++attempts < 12) window.setTimeout(check, 2500);
      }
    }
    check();
    return () => { active = false; };
  }, []);

  if (state === 'missing') return <p>We could not find an order in this link. Please check the email address used at checkout or contact TWKH with your Stripe receipt.</p>;
  if (state === 'ready') return <><p>Your artwork and field note are ready. A download link is also being delivered to the email address used at checkout.</p><a className="download-link" href={url}>Download your artwork</a><p>{expiresAt ? `Your private link is available through ${new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}. ` : ''}Keep the digital files for personal use; a physical print may be given as a gift.</p></>;
  return <><p>We are confirming your payment and preparing the download. This page will update automatically. Your download link will also arrive by email once payment is confirmed.</p><p>If it does not appear, contact TWKH with your Stripe receipt.</p></>;
}
