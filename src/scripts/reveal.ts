let observer: IntersectionObserver | undefined;

/**
 * Fade/slide [data-reveal] elements in once as they enter the viewport.
 * CSS hides them only when JS runs, motion is allowed and the 3s failsafe hasn't fired,
 * so no-JS, reduced-motion and script-failure cases always show content.
 */
export function initReveal(): void {
  observer?.disconnect();
  const root = document.documentElement;
  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')];

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.setAttribute('data-revealed', ''));
    root.classList.add('reveal-ready');
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      entering.forEach((el, i) => {
        observer?.unobserve(el);
        el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
        el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
        el.setAttribute('data-revealed', '');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  items.forEach((el) => observer!.observe(el));
  root.classList.add('reveal-ready');
}
