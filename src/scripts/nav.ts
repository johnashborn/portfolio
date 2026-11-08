let controller: AbortController | undefined;

/** Sticky-header background on scroll + accessible mobile menu sheet. Safe to call on every page load. */
export function initNav(): void {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const header = document.getElementById('site-header');
  const button = document.getElementById('menu-button');
  const sheet = document.getElementById('mobile-menu');
  if (!header || !button || !sheet) return;

  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true, signal });

  const focusables = () => [button, ...sheet.querySelectorAll<HTMLElement>('a[href], button')];

  const open = () => {
    sheet.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    sheet.querySelector<HTMLElement>('a[href]')?.focus();
  };
  const close = (returnFocus = true) => {
    sheet.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  };

  button.addEventListener('click', () => (sheet.hidden ? open() : close()), { signal });

  sheet.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) close(false);
  }, { signal });

  document.addEventListener('keydown', (e) => {
    if (sheet.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === -1 || i === items.length - 1 ? 0 : i + 1);
    e.preventDefault();
    items[next].focus();
  }, { signal });

  // Close the sheet if the viewport grows to desktop size.
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches && !sheet.hidden) close(false);
  }, { signal });
}
