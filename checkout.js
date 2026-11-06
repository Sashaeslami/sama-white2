// Reserve buttons post to the ticketing site, which opens the RSVP form (guests pay at the venue).
// While card payments are paused, there is no online checkout.
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

// Show the tier on sale right now, its price and places left, read live from the ticketing site.
// If it can't be reached, the line simply stays as "Limited capacity".
(async () => {
  const spots = document.querySelectorAll('[data-price-now]');
  if (!spots.length) return;
  try {
    const response = await fetch('https://tickets.samatopia.com/api/events/sama', { cache: 'no-store' });
    if (!response.ok) return;
    const { event } = await response.json();
    const now = Date.now();
    const tiers = [...(event.tiers || [])].sort((a, b) => a.position - b.position);
    const open = tiers.find(t => (t.closeMode === 'quantity' || now < Date.parse(t.deadline)) && (t.quota == null || (t.sold || 0) + (t.held || 0) < t.quota));
    const price = (value) => 'Rp ' + Number(value).toLocaleString('id-ID');
    let text;
    if (!open) text = 'All releases are spoken for right now · ';
    else {
      const left = open.quota == null ? null : open.quota - (open.sold || 0) - (open.held || 0);
      text = `${open.name} · ${price(open.price)}, pay at the venue${left !== null && left <= 10 ? ` · only ${left} left` : ''} · `;
    }
    spots.forEach(spot => { spot.textContent = text; });
  } catch { /* keep the static text */ }
})();
