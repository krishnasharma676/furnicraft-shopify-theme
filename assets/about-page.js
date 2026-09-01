/**
 * FurniCraft Luxury About Page Interactive Animations
 * Handles scroll reveal animations, animated counter numbers, and interactive card depth
 */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initAnimatedCounters();
  initCardParallax();
});

// Re-run on Shopify theme editor section load
document.addEventListener('shopify:section:load', () => {
  initScrollReveals();
  initAnimatedCounters();
  initCardParallax();
});

function initScrollReveals() {
  const revealElements = document.querySelectorAll('.about-reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('about-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.about-stat-card__number[data-target]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetStr = el.getAttribute('data-target') || el.innerText;
        const targetNum = parseInt(targetStr.replace(/\D/g, ''), 10);
        const prefix = targetStr.match(/^[^\d]*/)?.[0] || '';
        const suffix = targetStr.match(/[^\d]*$/)?.[0] || '';

        if (!isNaN(targetNum)) {
          let current = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(easeProgress * targetNum);

            el.innerText = `${prefix}${current.toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerText = targetStr;
            }
          }

          requestAnimationFrame(updateCounter);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counterElements.forEach(el => counterObserver.observe(el));
}

function initCardParallax() {
  const cards = document.querySelectorAll('.about-interactive-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y * 0.04}deg) rotateY(${x * 0.04}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
