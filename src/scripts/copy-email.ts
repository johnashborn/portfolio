/** Reveal and wire "Copy" buttons for the email address where the Clipboard API exists. */
export function initCopyEmail(): void {
  if (!navigator.clipboard?.writeText) return;
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-email]')) {
    if (button.dataset.ready) continue;
    button.dataset.ready = 'true';
    button.hidden = false;
    const label = button.textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.email ?? '');
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => (button.textContent = label), 2000);
    });
  }
}
