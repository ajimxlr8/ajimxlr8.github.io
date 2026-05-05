/* =============================================
   MD. AJIM HOSSAIN — main.js
   ============================================= */

/* ---- PAGE FADE-IN ---- */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.4s ease';
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.style.opacity = '1';
    });
  });
});

/* ---- NAV SCROLL ---- */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- MOBILE BURGER ---- */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    })
  );
}

/* ---- PAGE-TRANSITION LINKS ---- */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    !href || href.startsWith('#') || href.startsWith('mailto')
    || href.startsWith('tel') || href.startsWith('http')
    || link.hasAttribute('download') || link.target === '_blank'
  ) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.documentElement.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 360);
  });
});

/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal-up');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* ---- SKILL BAR ANIMATION ---- */
const bars = document.querySelectorAll('.skill-item__fill');
if (bars.length) {
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), 150);
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barIO.observe(b));
}

/* ---- IMAGE FALLBACK (show placeholder when img fails to load) ---- */
document.querySelectorAll('img').forEach(img => {
  // If image is already broken on load
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
  }
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  img.addEventListener('load', () => {
    // Hide placeholder sibling when image loads successfully
    const ph = img.nextElementSibling;
    if (ph && (
      ph.classList.contains('hero__photo-placeholder') ||
      ph.classList.contains('about-photo__placeholder') ||
      ph.classList.contains('rproject__photo-placeholder') ||
      ph.classList.contains('gallery-item__placeholder') ||
      ph.classList.contains('lph-placeholder') ||
      ph.classList.contains('tl-photo__placeholder')
    )) {
      ph.style.display = 'none';
    }
    img.style.display = '';
  });
});

/* ---- SUBTLE GOLD CURSOR DOT (desktop only) ---- */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed', 'pointer-events:none', 'z-index:9999',
    'width:7px', 'height:7px', 'border-radius:50%',
    'background:rgba(184,151,90,0.55)',
    'top:0', 'left:0',
    'transition:transform 0.12s ease',
    'mix-blend-mode:multiply',
  ].join(';');
  document.body.appendChild(dot);
  document.addEventListener('mousemove', e => {
    dot.style.transform = `translate(${e.clientX - 3.5}px,${e.clientY - 3.5}px)`;
  });
}
