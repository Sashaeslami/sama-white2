(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  // The testimonial types itself in, word by word, when it scrolls into view.
  // Words stay visible if this script never runs; it only hides them once it can show them again.
  const quote = document.querySelector('.typed');
  const mark = document.querySelector('.qmark');
  if (quote) {
    const parts = [quote, mark].filter(Boolean);
    parts.forEach((el) => el.classList.add('armed'));
    const typer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      parts.forEach((el) => { el.classList.remove('armed'); el.classList.add('play'); });
      typer.disconnect();
    }, { threshold: 0.35 });
    typer.observe(quote);
  }

  // Genre circles pop in one after another the first time they come into view.
  const genres = document.querySelector('.genres');
  if (genres) {
    genres.classList.add('armed');
    const popper = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      genres.classList.remove('armed');
      setTimeout(() => genres.classList.add('settled'), 2200);
      popper.disconnect();
    }, { threshold: 0.2 });
    popper.observe(genres);
  }

  // Scroll reveals for browsers without CSS scroll-driven animations (Firefox, older Safari).
  // Modern browsers do these in CSS, so the rest is skipped there.
  if (CSS.supports('animation-timeline: view()')) return;
  const targets = document.querySelectorAll('.rise, .grow, .feelings li');
  document.documentElement.classList.add('no-sdt');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach((el, i) => {
    if (el.matches('.feelings li')) el.style.transitionDelay = `${(i % 6) * 70}ms`;
    io.observe(el);
  });
})();
