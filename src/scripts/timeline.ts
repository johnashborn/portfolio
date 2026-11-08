let controller: AbortController | undefined;

/** Draws the Journey line downward as the section scrolls through the viewport. */
export function initTimeline(): void {
  controller?.abort();
  controller = new AbortController();

  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (!timeline) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timeline.style.setProperty('--progress', '1');
    return;
  }

  let frame = 0;
  const update = () => {
    frame = 0;
    const rect = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.75;
    const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
    timeline.style.setProperty('--progress', progress.toFixed(3));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: controller.signal });
}
