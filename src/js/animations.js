const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STAGGER_MS = 100;
const COUNT_DURATION_MS = 1600;

function animateCount(element) {
  const target = Number(element.dataset.count);
  const prefix = element.dataset.countPrefix ?? '';
  const render = (value) => {
    element.textContent = `${prefix}${Math.round(value).toLocaleString('en-US')}`;
  };

  if (prefersReducedMotion || !Number.isFinite(target)) {
    return;
  }

  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    render(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  render(0);
  requestAnimationFrame(step);
}

function setupReveal() {
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    [...group.children].forEach((child, index) => {
      child.dataset.reveal ??= '';
      child.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`);
    });
  });

  const targets = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        if (entry.target.matches('[data-count]')) animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  targets.forEach((element) => observer.observe(element));
}

setupReveal();
