let controller: AbortController | undefined;

/** Highlight (aria-current) the outline link of the case-study section currently being read. */
export function initToc(): void {
  controller?.abort();
  controller = new AbortController();

  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a[href^="#"]')];
  if (!links.length) return;
  const headings = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((h): h is HTMLElement => !!h);

  let frame = 0;
  const update = () => {
    frame = 0;
    const line = window.innerHeight * 0.4;
    let active = 0;
    headings.forEach((h, i) => {
      if (h.getBoundingClientRect().top <= line) active = i;
    });
    // Short final sections can never reach the line — at the very bottom, the last one is being read.
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) active = headings.length - 1;
    links.forEach((a, i) => (i === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: controller.signal });
}
