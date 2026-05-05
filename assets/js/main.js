/* ============================================
   AJIM HOSSAIN — main.js
   ============================================ */

// ---- NAV SCROLL STATE ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- MOBILE BURGER ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => {
  burger.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
});
// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('is-open');
    navLinks.classList.remove('is-open');
  });
});

// ---- INTERSECTION OBSERVER: REVEAL ----
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- SKILL BAR ANIMATION ----
const skillBars = document.querySelectorAll('.skill-item__fill');
if (skillBars.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay so the page reveal completes first
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => barObserver.observe(bar));
}

// ---- SMOOTH ACTIVE LINK HIGHLIGHT ----
// Already handled by static .active class on each page
// but we add a subtle underline draw on hover via CSS

// ---- CURSOR: subtle gold dot on desktop ----
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(196,154,60,0.6);
    top: 0; left: 0;
    transition: transform 0.15s ease, opacity 0.2s;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(cursor);
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

// ---- STAGGER TIMELINE ITEMS ----
const timelineItems = document.querySelectorAll('.timeline__item');
timelineItems.forEach((item, i) => {
  item.style.setProperty('--d', `${0.1 + i * 0.12}s`);
  item.classList.add('reveal-up');
  revealObserver.observe(item);
});

// ---- PAGE TRANSITION FADE-IN ----
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ---- NAV LINK PAGE TRANSITION ----
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    href &&
    !href.startsWith('#') &&
    !href.startsWith('mailto') &&
    !href.startsWith('tel') &&
    !href.startsWith('http') &&
    !link.hasAttribute('download') &&
    link.target !== '_blank'
  ) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  }
});
