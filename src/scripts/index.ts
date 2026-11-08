import { initReveal } from './reveal';
import { initNav } from './nav';
import { initGlow } from './glow';
import { initCounters } from './counter';
import { initTimeline } from './timeline';
import { initContactForm } from './contact';
import { initCopyEmail } from './copy-email';
import { initToc } from './toc';

const inits = [initReveal, initNav, initGlow, initCounters, initTimeline, initContactForm, initCopyEmail, initToc];

/** Runs on first load and after every client-side navigation. One failing effect never blocks the others. */
document.addEventListener('astro:page-load', () => {
  for (const init of inits) {
    try {
      init();
    } catch (err) {
      console.warn(`[portfolio] ${init.name} failed`, err);
      if (init === initReveal) document.documentElement.classList.add('reveal-failed');
    }
  }
});
