import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('home page smoke', () => {
  const $ = loadPage('/');

  it('declares English', () => {
    expect($('html').attr('lang')).toBe('en');
  });

  it('has a non-empty title', () => {
    expect($('title').text().trim().length).toBeGreaterThan(0);
  });

  it('links a stylesheet', () => {
    expect($('link[rel="stylesheet"], style').length).toBeGreaterThan(0);
  });
});
