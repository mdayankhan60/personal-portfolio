/**
 * script.js – Mohammed Ayan Khan Portfolio
 * Features:
 *  - Typed role animation (hero)
 *  - Active nav link on scroll (IntersectionObserver)
 *  - Sticky nav JS fallback (IntersectionObserver)
 *  - Mobile navbar auto-close on link click
 *  - Skill progress bar animated fill on scroll
 *  - Contact form validation + success message
 *  - Back-to-top button
 *  - Footer year auto-update
 */

'use strict';

/* ============================================================
   UTILITY
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ============================================================
   FOOTER YEAR
   ============================================================ */
const footerYear = $('#footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ============================================================
   TYPED ROLE ANIMATION
   ============================================================ */
const roles = [
  'CSE Student 🎓',
  'Frontend Developer',
  'Web Enthusiast',
  'Problem Solver',
  'Open Source Learner',
];

const typedEl = $('#typedRole');
if (typedEl) {
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, PAUSE_AFTER);
      }
      return setTimeout(tick, TYPING_SPEED);
    }
    // deleting
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      return setTimeout(tick, PAUSE_BEFORE);
    }
    return setTimeout(tick, DELETING_SPEED);
  }
  tick();
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT ON SCROLL (IntersectionObserver)
   ============================================================ */
const sections = $$('section[id]');
const navLinks = $$('#navbarNav .nav-link');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = $(`#navbarNav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );
  sections.forEach((sec) => navObserver.observe(sec));
}

/* ============================================================
   STICKY NAV JS FALLBACK (IntersectionObserver)
   Covers browsers that don't support container scroll-state queries
   (Firefox, Safari).
   ============================================================ */
function getScrollParent(node) {
  if (!node || node === document.body || node === document.documentElement) return null;
  const { overflow } = getComputedStyle(node);
  if (
    (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) &&
    overflow !== 'visible' &&
    overflow !== 'clip'
  ) return node;
  return getScrollParent(node.parentElement);
}

const stickyContainers = $$('.sticky-container');
stickyContainers.forEach((container) => {
  const nav = container.querySelector('#mainNav');
  if (!nav) return;

  const root = getScrollParent(container);
  const topOffset = parseFloat(getComputedStyle(container).top) || 0;

  const stickyObserver = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('is-stuck', entry.intersectionRatio < 1);
    },
    {
      root,
      threshold: [1],
      rootMargin: `-${topOffset + 1}px 0px 0px 0px`,
    }
  );
  stickyObserver.observe(container);
});

/* ============================================================
   MOBILE NAVBAR – AUTO-CLOSE ON LINK CLICK
   ============================================================ */
const navbarCollapse = $('#navbarNav');
if (navbarCollapse) {
  navbarCollapse.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    }
  });
}

/* ============================================================
   SKILL PROGRESS BARS – ANIMATE ON SCROLL
   ============================================================ */
const progressBars = $$('.progress-bar');

if (progressBars.length) {
  // Store target widths, reset to 0 for animation
  progressBars.forEach((bar) => {
    bar.dataset.target = bar.style.width;
    bar.style.width = '0%';
  });

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.target;
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
const contactForm = $('#contactForm');
const successAlert = $('#formSuccessAlert');
const submitBtn   = $('#submitBtn');

if (contactForm && submitBtn) {
  const fields = {
    contactName: {
      el: $('#contactName'),
      validate(v) { return v.trim().length >= 2; },
      msg: 'Please enter your name (at least 2 characters).',
    },
    contactEmail: {
      el: $('#contactEmail'),
      validate(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      msg: 'Please enter a valid email address.',
    },
    contactSubject: {
      el: $('#contactSubject'),
      validate(v) { return v.trim().length >= 4; },
      msg: 'Please enter a subject (at least 4 characters).',
    },
    contactMessage: {
      el: $('#contactMessage'),
      validate(v) { return v.trim().length >= 10; },
      msg: 'Please enter your message (at least 10 characters).',
    },
  };

  /* Real-time field validation */
  Object.values(fields).forEach(({ el, validate }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      if (validate(el.value)) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
      }
    });
    el.addEventListener('blur', () => {
      if (el.value.trim() !== '') {
        if (!validate(el.value)) el.classList.add('is-invalid');
      }
    });
  });

  /* Form submit */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach(({ el, validate }) => {
      if (!el) return;
      if (validate(el.value)) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
        isValid = false;
      }
    });

    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Simulate sending */
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');

    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.classList.remove('d-none');
      btnLoading.classList.add('d-none');

      // Show success
      if (successAlert) {
        successAlert.classList.remove('d-none');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form state
      contactForm.reset();
      Object.values(fields).forEach(({ el }) => {
        if (el) { el.classList.remove('is-valid', 'is-invalid'); }
      });

      // Auto-hide success after 6 s
      setTimeout(() => {
        if (successAlert) successAlert.classList.add('d-none');
      }, 6000);
    }, 1400);
  });
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
const backToTopBtn = $('#backToTop');

if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.removeAttribute('hidden');
    } else {
      backToTopBtn.setAttribute('hidden', '');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop(); // run once on load

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   SMOOTH SCROLL for all anchor links (fallback for older browsers)
   ============================================================ */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = $(anchor.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Update URL without jumping
    history.pushState(null, '', anchor.getAttribute('href'));
  }
});
