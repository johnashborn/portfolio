let controller: AbortController | undefined;

/** Soft light that follows the pointer over [data-glow] cards (pointer devices only). */
export function initGlow(): void {
  controller?.abort();
  controller = new AbortController();
  if (!window.matchMedia('(hover: hover)').matches) return;

  for (const el of document.querySelectorAll<HTMLElement>('[data-glow]')) {
    el.addEventListener(
      'pointermove',
      (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - rect.left}px`);
        el.style.setProperty('--y', `${e.clientY - rect.top}px`);
      },
      { signal: controller.signal },
    );
  }
}
