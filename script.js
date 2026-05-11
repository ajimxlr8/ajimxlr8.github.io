/* ============================================================
   MD. AJIM HOSSAIN — SINGLE-PAGE PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ---- PAGE FADE-IN ---- */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.38s ease';
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.documentElement.style.opacity = '1';
    })
  );
});

/* ---- CACHE DOM ---- */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const allLinks = navLinks ? navLinks.querySelectorAll('a[data-section]') : [];
const sections = document.querySelectorAll('section[id], div[id]');

/* ============================================================
   NAV — SCROLL SHADOW
   ============================================================ */
function onScroll() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   MOBILE BURGER MENU
   ============================================================ */
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* Close menu when any nav link clicked */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   SMOOTH SCROLL — anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = (nav ? nav.offsetHeight : 66) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   ACTIVE NAV LINK — highlight while scrolling
   ============================================================ */
const navHeight = nav ? nav.offsetHeight : 66;

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top - navHeight - 40;
    if (top <= 0) current = section.id;
  });

  allLinks.forEach(link => {
    const sec = link.getAttribute('data-section');
    link.classList.toggle('active', sec === current);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ============================================================
   REVEAL ON SCROLL — .reveal-up elements
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal-up');

if ('IntersectionObserver' in window && revealEls.length) {
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealIO.observe(el));
} else {
  /* Fallback: show all immediately */
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* ============================================================
   SKILL BARS — animate width on scroll into view
   ============================================================ */
const skillBars = document.querySelectorAll('.skill-item__fill');

if ('IntersectionObserver' in window && skillBars.length) {
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Small delay lets the reveal-up animation finish first */
        setTimeout(() => entry.target.classList.add('animated'), 180);
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => barIO.observe(bar));
} else {
  skillBars.forEach(bar => bar.classList.add('animated'));
}

/* ============================================================
   IMAGE FALLBACK — hide broken images, show placeholders
   ============================================================ */
function handleImg(img) {
  /* Already broken before JS ran */
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    return;
  }
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  img.addEventListener('load', () => {
    /* Hide adjacent placeholder when image loads successfully */
    const next = img.nextElementSibling;
    if (next && next.matches(
      '.hero__photo-placeholder, .about-photo__placeholder, ' +
      '.rproject__photo-placeholder, .gallery-item__placeholder, ' +
      '.lph-placeholder, .tl-photo__placeholder'
    )) {
      next.style.display = 'none';
    }
  });
}
document.querySelectorAll('img').forEach(handleImg);

/* ============================================================
   CONTACT FORM — mailto handler
   ============================================================ */
function sendEmail() {
  const name    = (document.getElementById('cf-name')    || {}).value || '';
  const email   = (document.getElementById('cf-email')   || {}).value || '';
  const subject = (document.getElementById('cf-subject') || {}).value || '';
  const message = (document.getElementById('cf-message') || {}).value || '';

  if (!name.trim() || !email.trim() || !message.trim()) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto =
    `mailto:ajim.che.buet@gmail.com` +
    `?subject=${encodeURIComponent(subject || 'Message from Portfolio')}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}

/* Expose for onclick in HTML */
window.sendEmail = sendEmail;

/* ============================================================
   SUBTLE GOLD CURSOR DOT — desktop only
   ============================================================ */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.createElement('div');
  dot.setAttribute('aria-hidden', 'true');
  dot.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:9999',
    'width:7px',
    'height:7px',
    'border-radius:50%',
    'background:rgba(184,151,90,0.5)',
    'top:0',
    'left:0',
    'transform:translate(-50%,-50%)',
    'transition:transform 0.1s linear',
    'will-change:transform',
  ].join(';');
  document.body.appendChild(dot);

  let raf;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      dot.style.transform = `translate(${e.clientX - 3.5}px, ${e.clientY - 3.5}px)`;
    });
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
}

/* ============================================================
   TICKER — pause on hover / resume on leave
   ============================================================ */
const tickerTrack = document.querySelector('.ticker__track');
if (tickerTrack) {
  const ticker = tickerTrack.parentElement;
  ticker.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}
