// Behaviour for the standalone templates.
//
// The Angular site provides four interactive behaviours through components and
// a directive. A template has no framework, so they are re-implemented here in
// about sixty lines of plain JavaScript. Everything degrades: with this file
// missing or blocked, the page still renders and reads correctly — only the
// entrance animation, the mobile menu, the hover highlight and the image
// fallback are absent.
//
// This file is copied into each template folder by scripts/build-templates.mjs.

(() => {
  'use strict';

  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // 1. Entrance animation — mirrors RevealOnViewDirective.
  //    Same observer options as the directive, and the same shortcut: with
  //    reduced motion asked for, or no IntersectionObserver, everything is
  //    revealed at once rather than never.
  // ---------------------------------------------------------------------------
  const revealed = document.querySelectorAll('.reveal-on-view');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealed.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    revealed.forEach((element) => observer.observe(element));
  }

  // ---------------------------------------------------------------------------
  // 2. Mobile menu — mirrors SiteHeaderComponent.
  //    The button only becomes visible below 1200px; above that the nav is laid
  //    out horizontally and this code never has anything to do.
  // ---------------------------------------------------------------------------
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-primary-nav]');

  if (toggle && nav) {
    const icon = toggle.querySelector('.material-symbols-outlined');
    const label = toggle.querySelector('.sr-only');

    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (icon) icon.textContent = open ? 'close' : 'menu';
      if (label) label.textContent = open ? '關閉主選單' : '開啟主選單';
    };

    setMenu(false);
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

    // Every link in the header dismisses the menu, as it does in the app.
    document
      .querySelectorAll('[data-primary-nav] a, .site-header .login-link')
      .forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Active news card — mirrors ConceptPage's activeNews signal, which starts
  //    at the first card and follows the pointer or keyboard focus.
  // ---------------------------------------------------------------------------
  const cards = document.querySelectorAll('.news-card, .news-item');

  if (cards.length) {
    const activate = (card) =>
      cards.forEach((other) => other.classList.toggle('is-active', other === card));

    activate(cards[0]);
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => activate(card));
      card.addEventListener('focusin', () => activate(card));
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Image fallback — mirrors markImageFailed(). A missing image leaves its
  //    frame drawn in the concept's own placeholder treatment rather than a
  //    broken-image icon.
  // ---------------------------------------------------------------------------
  const FRAMES = '.hero-media, .events-media, .resources-media, .membership-media';

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      const frame = image.closest(FRAMES) ?? image.parentElement;
      if (frame) frame.classList.add('image-fallback');
      image.remove();
    });
  });
})();
