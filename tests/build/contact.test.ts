import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';
import { site } from '../../src/site';

describe('contact form markup (Netlify Forms)', () => {
  const $ = loadPage('/');
  const form = $('section#contact form[name="contact"]');

  it('is detectable by Netlify at build time', () => {
    expect(form.length).toBe(1);
    expect(form.attr('method')?.toUpperCase()).toBe('POST');
    expect(form.attr('data-netlify')).toBe('true');
    expect(form.attr('netlify-honeypot')).toBe('bot-field');
    expect(form.attr('action')).toBe('/thanks');
  });

  it('carries the hidden form-name field', () => {
    expect(form.find('input[type="hidden"][name="form-name"]').attr('value')).toBe('contact');
  });

  it('hides the honeypot from people', () => {
    const honeypot = form.find('input[name="bot-field"]');
    expect(honeypot.length).toBe(1);
    expect(honeypot.closest('.sr-only, [hidden]').length).toBe(1);
  });

  it('has labelled, required name, email and message fields', () => {
    for (const name of ['name', 'email', 'message']) {
      const field = form.find(`[name="${name}"]`);
      expect(field.attr('required')).toBeDefined();
      const id = field.attr('id');
      expect(id).toBeTruthy();
      expect(form.find(`label[for="${id}"]`).length).toBe(1);
    }
    expect(form.find('input[name="email"]').attr('type')).toBe('email');
  });

  it('labels the section 04 / Contact', () => {
    expect($('section#contact .label-mono').first().text().trim()).toBe('04 / Contact');
  });
});

describe('reply-time promise', () => {
  it('comes from site config on both the contact section and /thanks', () => {
    expect(site.replyTime.length).toBeGreaterThan(0);
    expect(loadPage('/')('section#contact').text()).toContain(site.replyTime);
    expect(loadPage('/thanks')('main').text()).toContain(site.replyTime);
  });
});

describe('/thanks', () => {
  const $ = loadPage('/thanks');

  it('links home and is not indexed', () => {
    expect($('main a[href="/"]').length).toBeGreaterThan(0);
    expect($('meta[name="robots"]').attr('content')).toBe('noindex');
  });
});
