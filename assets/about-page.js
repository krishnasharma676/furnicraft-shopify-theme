/**
 * FurniCraft Luxury About Page Interactive Animations
 * Clean, production-safe ES6 implementation without lint or compiler warnings.
 */
(() => {
  'use strict';

  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.about-reveal');
    if (!revealElements || revealElements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => {
        el.classList.add('about-revealed');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
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
    if (!counterElements || counterElements.length === 0) return;

    if (!('IntersectionObserver' in window)) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetAttr = el.getAttribute('data-target');
          const targetStr = targetAttr ? targetAttr.trim() : (el.textContent ? el.textContent.trim() : '');
          const cleanNumStr = targetStr.replace(/\D/g, '');
          const targetNum = parseInt(cleanNumStr, 10);

          const prefixMatch = targetStr.match(/^[^\d]*/);
          const prefix = prefixMatch ? prefixMatch[0] : '';

          const suffixMatch = targetStr.match(/[^\d]*$/);
          const suffix = suffixMatch ? suffixMatch[0] : '';

          if (!isNaN(targetNum) && targetNum > 0) {
            let current = 0;
            const duration = 1500;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(easeProgress * targetNum);

              el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = targetStr;
              }
            };

            requestAnimationFrame(updateCounter);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.35 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function initCardParallax() {
    const cards = document.querySelectorAll('.about-interactive-card');
    if (!cards || cards.length === 0) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y * 0.035}deg) rotateY(${x * 0.035}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  function init() {
    initScrollReveals();
    initAnimatedCounters();
    initCardParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Support Shopify Theme Editor dynamic reloading
  document.addEventListener('shopify:section:load', init);
})();
