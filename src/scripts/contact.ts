type FieldEl = HTMLInputElement | HTMLTextAreaElement;

const messages: Record<string, (el: FieldEl) => string> = {
  name: () => 'Please enter your name.',
  email: (el) => (el.validity.valueMissing ? 'Please enter your email.' : 'Please enter a valid email address.'),
  message: () => 'Please write a short message.',
};

/** Validate one field, update its error text and aria-invalid; returns true when valid. */
function validate(el: FieldEl): boolean {
  const error = document.getElementById(`${el.id}-error`);
  const ok = el.checkValidity();
  el.setAttribute('aria-invalid', String(!ok));
  if (error) error.textContent = ok ? '' : (messages[el.name]?.(el) ?? el.validationMessage);
  return ok;
}

/** Netlify Forms over fetch: inline validation, sending state, success/error without a reload. */
export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('form[name="contact"]');
  if (!form || form.dataset.state) return;
  const card = form.parentElement!;
  const success = card.querySelector<HTMLElement>('[data-form-success]')!;
  const failure = form.querySelector<HTMLElement>('[data-form-error]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const fields = [...form.querySelectorAll<FieldEl>('input[required], textarea[required]')];

  form.noValidate = true; // we show our own accessible messages instead of browser bubbles
  form.dataset.state = 'idle';

  for (const el of fields) {
    el.addEventListener('blur', () => el.value && validate(el));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && validate(el));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = fields.filter((el) => !validate(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    form.dataset.state = 'sending';
    failure.hidden = true;
    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Sending…';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.dataset.state = 'success';
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      form.dataset.state = 'error';
      failure.hidden = false;
      button.disabled = false;
      button.textContent = label;
    }
  });
}
