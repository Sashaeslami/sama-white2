// Reserve buttons post to the ticketing site, which holds a place and redirects to Stripe Checkout.
// Ambassador links (samatopia.com/?ref=CODE) pass their code along with every Reserve button.
const forms = [...document.querySelectorAll('form[data-ticket-form]')];
const linkedCode = new URLSearchParams(location.search).get('ref')?.trim().toUpperCase() || '';
const code = /^[A-Z0-9][A-Z0-9-]{2,31}$/.test(linkedCode) ? linkedCode : '';

let attempt = '';
let startedAt = 0;
for (const form of forms) {
  form.addEventListener('submit', () => {
    // Reuse the attempt while its 31-minute hold is open, so coming back and pressing again keeps one place.
    if (!attempt || Date.now() - startedAt > 25 * 60000) {
      attempt = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
      startedAt = Date.now();
    }
    form.elements.namedItem('attempt').value = attempt;
    form.elements.namedItem('ref').value = code;
  });
}
