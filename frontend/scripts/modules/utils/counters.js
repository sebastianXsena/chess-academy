// ============================================================
// === CONTADORES ANIMADOS ===
// ============================================================

export function initCounters() {
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isPercent = el.closest('.hero-stat')?.querySelector('.stat-label')?.textContent.includes('%');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target) && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, target);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
}
