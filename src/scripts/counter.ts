let observer: IntersectionObserver | undefined;

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Count numeric stats up from 0 the first time they scroll into view. Skipped under reduced motion. */
export function initCounters(): void {
  observer?.disconnect();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [...document.querySelectorAll<HTMLElement>('[data-count-target][data-count]')];
  if (!targets.length) return;

  const render = (el: HTMLElement, n: number) => {
    el.textContent = `${el.dataset.prefix ?? ''}${n}${el.dataset.suffix ?? ''}`;
  };

  for (const el of targets) render(el, 0);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer?.unobserve(el);
        const end = Number(el.dataset.count);
        const decimals = (el.dataset.count?.split('.')[1] ?? '').length;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          render(el, Number((end * easeOut(t)).toFixed(decimals)) as number);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = el.dataset.final ?? String(end);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.4 },
  );
  for (const el of targets) observer.observe(el);
}
