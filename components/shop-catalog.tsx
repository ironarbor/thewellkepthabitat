'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, Search, ShoppingBag, Truck, X } from 'lucide-react';
import { catalog, type CatalogItem, type ShopFormat } from '@/lib/shop-catalog';

type Filter = 'all' | ShopFormat;
const CART_KEY = 'twkh-shop-cart-v1';
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export function ShopCatalog() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [cart, setCart] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [availableSlugs, setAvailableSlugs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as unknown;
      if (Array.isArray(saved)) setCart(saved.filter((id): id is string => typeof id === 'string' && catalog.some(item => item.id === id)));
    } catch { /* An invalid saved cart starts empty. */ }
    setCartLoaded(true);
    fetch('/api/shop/product').then(response => response.json() as Promise<{ available?: boolean; price?: string; products?: Record<string, { available?: boolean; price?: string }> }>).then(data => {
      setAvailableSlugs(Object.entries(data.products ?? {}).filter(([, value]) => value.available && value.price === '$4.00').map(([slug]) => slug));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (cartLoaded) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, cartLoaded]);

  useEffect(() => {
    if (!cartOpen && !selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCartOpen(false); setSelected(null); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [cartOpen, selected]);

  const results = useMemo(() => catalog.filter(item => {
    const matchesFilter = filter === 'all' || item.format === filter;
    const terms = `${item.title} ${item.description} ${item.format} ${item.details}`.toLowerCase();
    return matchesFilter && terms.includes(query.trim().toLowerCase());
  }), [filter, query]);
  const cartItems = cart.map(id => catalog.find(item => item.id === id)).filter((item): item is CatalogItem => Boolean(item));
  const hasPendingItems = cartItems.some(item => item.priceCents === null);
  const hasUnfinishedEditions = cartItems.some(item => !item.editionReady);
  const canCheckout = cartItems.length === 1 && cartItems[0].format === 'digital' && availableSlugs.includes(cartItems[0].artwork);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceCents ?? 0), 0);

  function addToCart(item: CatalogItem) {
    setCart(current => current.includes(item.id) ? current : [...current, item.id]);
    setSelected(null);
    setMessage('');
    setCartOpen(true);
  }

  async function startCheckout() {
    if (!canCheckout) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/shop/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: cartItems[0].artwork }),
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Checkout is unavailable.');
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Checkout is unavailable.');
      setBusy(false);
    }
  }

  return <>
    <section className="catalog-toolbar" aria-label="Shop controls">
      <div className="catalog-filters" role="group" aria-label="Product format">
        {([['all', 'All artwork'], ['digital', 'Digital downloads'], ['print', 'Physical prints']] as const).map(([value, label]) =>
          <button key={value} type="button" className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <div className="catalog-actions">
        <label className="catalog-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search artwork</span><input type="search" placeholder="Search artwork" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <button className="catalog-cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cart.length} items`}><ShoppingBag size={20} aria-hidden="true" /> Cart <span>{cart.length}</span></button>
      </div>
    </section>
    <section className="catalog-content" aria-label="Artwork catalog">
      <div className="catalog-count"><span>{results.length} {results.length === 1 ? 'item' : 'items'}</span><span>Photographs by Shekeyla Sandore</span></div>
      {results.length ? <div className="catalog-grid">{results.map(item => <article className="catalog-card" key={item.id}>
        <button type="button" className="catalog-card-image" onClick={() => setSelected(item)} aria-label={`View ${item.title}, ${item.format === 'digital' ? 'digital download' : 'physical print'}`}><img src={item.image} alt={item.imageAlt} loading="lazy" /></button>
        <div className="catalog-card-body">
          <p className="catalog-card-format">{item.format === 'digital' ? <Download size={14} aria-hidden="true" /> : <Truck size={14} aria-hidden="true" />}{item.format === 'digital' ? 'Digital download' : 'Physical print'} <span>· {item.editionReady ? 'First edition' : 'In preparation'}</span></p>
          <h2>{item.title}</h2>
          <p className="catalog-card-description">{item.description}</p>
          <div className="catalog-card-bottom"><p className="catalog-card-price">{item.priceCents !== null ? <>{money(item.priceCents)} <small>before tax</small></> : <span>Price to come</span>}</p><button type="button" onClick={() => setSelected(item)}>View details <ArrowRight size={15} aria-hidden="true" /></button></div>
        </div>
      </article>)}</div> : <div className="catalog-empty"><h2>No artwork found</h2><p>Try a different search or browse all artwork.</p><button type="button" onClick={() => { setQuery(''); setFilter('all'); }}>Show all artwork</button></div>}
    </section>

    {selected && <div className="catalog-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}><section className="catalog-detail" role="dialog" aria-modal="true" aria-labelledby="catalog-detail-title">
      <button className="catalog-close" type="button" onClick={() => setSelected(null)} aria-label="Close details"><X size={22} /></button>
      <img src={selected.image} alt={selected.imageAlt} />
      <div className="catalog-detail-copy"><p className="kicker">{selected.format === 'digital' ? 'Digital download' : 'Physical print'} · Educational artwork</p><h2 id="catalog-detail-title">{selected.title}</h2><p>{selected.details}</p>
        {selected.format === 'print' && <p className="catalog-detail-note">Print price and shipping cost will be shown before checkout when physical orders open.</p>}
        <p className="catalog-detail-price">{selected.priceCents !== null ? `${money(selected.priceCents)} before tax` : 'Price in preparation'}</p>
        <button type="button" className="catalog-primary-button" onClick={() => addToCart(selected)}>{selected.editionReady ? 'Add to cart' : 'Save to preview cart'}</button>
        <p className="catalog-detail-note">{selected.format === 'digital' ? selected.editionReady ? 'Digital files are for personal use; nothing will be shipped.' : 'The download files and field note are being prepared; orders are not open yet.' : 'Physical print orders are not open yet.'}</p>
      </div>
    </section></div>}

    {cartOpen && <div className="catalog-overlay cart-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="catalog-cart" role="dialog" aria-modal="true" aria-labelledby="catalog-cart-title">
      <header><div><p className="kicker">Your selection</p><h2 id="catalog-cart-title">Shopping cart <span>({cart.length})</span></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={22} /></button></header>
      {cartItems.length ? <><div className="catalog-cart-items">{cartItems.map(item => <div className="catalog-cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.title}</strong><span>{item.format === 'digital' ? 'Digital download' : 'Physical print'}</span><span>{item.priceCents !== null ? money(item.priceCents) : 'Price pending'}</span><button type="button" onClick={() => setCart(current => current.filter(id => id !== item.id))}>Remove</button></div></div>)}</div>
        <div className="catalog-cart-summary"><p><span>Priced items</span><strong>{money(subtotal)}</strong></p>{hasUnfinishedEditions && <p className="catalog-cart-pending">Some editions are still in preparation. This cart cannot be checked out until their files or print fulfillment are ready.</p>}{hasPendingItems && <p className="catalog-cart-pending">Additional item prices are pending. Shipping for physical prints will be shown before payment.</p>}
          <button className="catalog-primary-button" type="button" disabled={!canCheckout || busy} onClick={startCheckout}>{busy ? 'Opening checkout…' : canCheckout ? 'Continue to secure checkout' : 'Checkout opening soon'}</button>
          <p className="catalog-cart-note">{canCheckout ? 'Final total is shown in Stripe Checkout before payment. Purchase one digital edition at a time.' : cartItems.length > 1 && !hasUnfinishedEditions && !hasPendingItems ? 'Purchase one digital edition at a time. Remove the others to continue.' : 'This cart cannot be checked out yet. No payment will be taken.'}</p><p role="status" aria-live="polite">{message}</p>
        </div></> : <div className="catalog-cart-empty"><ShoppingBag size={32} aria-hidden="true" /><p>Your cart is empty.</p><button type="button" onClick={() => setCartOpen(false)}>Browse artwork</button></div>}
    </aside></div>}
  </>;
}
