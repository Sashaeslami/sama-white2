// Scroll reveals for browsers without CSS scroll-driven animations (Firefox, older Safari).
// Modern browsers do all motion in CSS; this file then does nothing.
(() => {
  if (CSS.supports('animation-timeline: view()')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
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
