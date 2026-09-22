'use client';

import { ArrowRight, Check, Download, LoaderCircle } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';

interface AccessResponse {
  downloadUrl?: string;
  error?: string;
}

export function HabitatPortraitForm() {
  const [submitting, setSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const search = new URLSearchParams(window.location.search);

    try {
      const response = await fetch('/api/habitat-portrait/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          firstName: form.get('firstName'),
          town: form.get('town'),
          marketingConsent: form.get('marketingConsent') === 'yes',
          website: form.get('website'),
          utmSource: search.get('utm_source'),
          utmMedium: search.get('utm_medium'),
          utmCampaign: search.get('utm_campaign'),
        }),
      });
      const data = (await response.json()) as AccessResponse;

      if (!response.ok || !data.downloadUrl) {
        throw new Error(data.error || 'The report could not be prepared. Please try again.');
      }

      setDownloadUrl(data.downloadUrl);
      window.location.assign(data.downloadUrl);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'The report could not be prepared. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (downloadUrl) {
    return (
      <output className="portrait-form-success">
        <Check size={28} aria-hidden="true" />
        <p className="kicker">Your report is ready</p>
        <h2>Thank you for taking a closer look.</h2>
        <p>Your download should begin automatically. The private link remains available for 15 minutes.</p>
        <a className="button button-forest" href={downloadUrl}>
          Download again <Download size={17} />
        </a>
      </output>
    );
  }

  return (
    <form className="portrait-access-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow"><span /> Complimentary sample report</p>
        <h2>Receive the Viscount Road portrait.</h2>
        <p className="portrait-form-intro">Enter your email to unlock this complete 17-page example.</p>
      </div>

      <label>
        Email address <span aria-hidden="true">*</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <div className="portrait-form-row">
        <label>
          First name <span>Optional</span>
          <input name="firstName" type="text" maxLength={80} />
        </label>
        <label>
          Town <span>Optional</span>
          <input name="town" type="text" autoComplete="address-level2" maxLength={100} />
        </label>
      </div>

      <label className="portrait-consent">
        <input name="marketingConsent" type="checkbox" value="yes" />
        <span>Yes, send me occasional TWKH editorial and service updates. I can unsubscribe at any time.</span>
      </label>

      <label className="portrait-form-trap" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <button className="button button-forest" type="submit" disabled={submitting}>
        {submitting ? (
          <>Preparing your report <LoaderCircle className="portrait-spinner" size={17} /></>
        ) : (
          <>Unlock the report <ArrowRight size={17} /></>
        )}
      </button>

      <p className="portrait-privacy-note">
        Report delivery and permission to receive future updates are recorded separately. Your information is not sold.
      </p>
      {error && <p className="portrait-form-error" role="alert">{error}</p>}
    </form>
  );
}
