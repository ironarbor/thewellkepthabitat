'use client';

import { useEffect, useState } from 'react';

export function ShopCheckoutButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('/api/shop/product').then(response => response.json() as Promise<{ available?: boolean; price?: string }>).then(product => {
      if (product.available && product.price) setPrice(product.price);
    }).catch(() => {});
  }, []);

  async function startCheckout() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/shop/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: 'visit-to-the-hyssop' }) });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Checkout is temporarily unavailable.');
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Checkout is temporarily unavailable.');
      setBusy(false);
    }
  }

  return <div className="art-buy-area"><button className="art-buy-button" type="button" onClick={startCheckout} disabled={busy || !price}>{busy ? 'Opening checkout…' : price ? `Buy the digital edition · ${price}` : 'Sales opening soon'}</button><p role="status" aria-live="polite">{message}</p></div>;
}
