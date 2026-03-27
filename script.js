/* ═══════════════════════════════════════════════════════════
   Himanshu Nakrani — Portfolio JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════
   1. PRELOADER
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const preloader = $('#preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1400);
});

document.body.style.overflow = 'hidden';

/* ══════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════ */
(function initCursor() {
  const dot = $('#cursorDot');
  const outline = $('#cursorOutline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effect on interactive elements
  const interactives = 'a, button, .skill-tab, .filter-btn, .project-link, .testimonial-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) outline.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) outline.classList.remove('cursor-hover');
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; outline.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; outline.style.opacity = '1'; });
})();

/* ══════════════════════════════════════════
   3. PARTICLE CANVAS
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#6366f1' : '#8b5cf6';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connections between close particles
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(animate);
  }

  // Only run particles when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate();
    } else {
      cancelAnimationFrame(animFrame);
    }
  }, { threshold: 0 });

  const heroSection = $('#hero');
  if (heroSection) heroObserver.observe(heroSection);
})();

/* ══════════════════════════════════════════
   4. TYPED TEXT EFFECT
══════════════════════════════════════════ */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'Software Engineer',
    'Backend Architect',
    'Open Source Enthusiast',
    'Problem Solver',
    'Tech Innovator'
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    el.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);

    let delay = deleting ? 60 : 100;

    if (!deleting && charIdx > current.length) {
      deleting = true;
      delay = 2000; // Pause before deleting
    } else if (deleting && charIdx < 0) {
      deleting = false;
      charIdx = 0;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 1600);
})();

/* ══════════════════════════════════════════
   5. NAVBAR — Scroll + Active Link
══════════════════════════════════════════ */
(function initNavbar() {
  const header = $('#header');
  const navLinks = $$('.nav-link');
  const hamburger = $('#hamburger');
  const navLinksContainer = $('#navLinks');
  const scrollTopBtn = $('#scrollTop');

  // Scroll effects
  function onScroll() {
    const scrollY = window.scrollY;

    // Sticky header
    header.classList.toggle('scrolled', scrollY > 20);

    // Active nav link
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 100) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Scroll to top button
    scrollTopBtn.classList.toggle('show', scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll to top
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });
})();

/* ══════════════════════════════════════════
   6. THEME TOGGLE
══════════════════════════════════════════ */
(function initTheme() {
  const btn = $('#themeToggle');
  const icon = $('#themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('portfolio-theme', next);
  });
})();

/* ══════════════════════════════════════════
   7. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════ */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children within parent group
        const siblings = $$('[data-aos]', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('aos-animate');

        // Animate skill bars when visible
        const skillFills = $$('.skill-fill', entry.target);
        skillFills.forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });

        // Animate counters
        const counters = $$('.stat-number', entry.target);
        counters.forEach(animateCounter);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  $$('[data-aos]').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   8. ANIMATED COUNTER
══════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;

  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════
   9. SKILL FILTER TABS
══════════════════════════════════════════ */
(function initSkillTabs() {
  const tabs = $$('.skill-tab');
  const cards = $$('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);

        // Re-trigger skill bar animation
        if (show) {
          const fill = card.querySelector('.skill-fill');
          if (fill) {
            fill.style.width = '0';
            setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 50);
          }
        }
      });
    });
  });

  // Animate initially visible skills
  setTimeout(() => {
    cards.forEach(card => {
      if (!card.classList.contains('hidden')) {
        const fill = card.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }
    });
  }, 1600);
})();

/* ══════════════════════════════════════════
   10. PROJECT FILTERS
══════════════════════════════════════════ */
(function initProjectFilters() {
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.classList.remove('hidden');
          // Reset featured span for non-all filters
          if (filter !== 'all') card.style.gridColumn = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════
   11. TESTIMONIALS SLIDER
══════════════════════════════════════════ */
(function initTestimonials() {
  const cards = $$('.testimonial-card');
  const dotsContainer = $('#testimonialDots');
  const prevBtn = $('#prevTestimonial');
  const nextBtn = $('#nextTestimonial');

  if (!cards.length) return;

  let current = 0;
  let autoplay;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    cards[current].classList.remove('active');
    $$('.testimonial-dot')[current].classList.remove('active');
    current = (idx + cards.length) % cards.length;
    cards[current].classList.add('active');
    $$('.testimonial-dot')[current].classList.add('active');
  }

  cards[0].classList.add('active');

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }
  resetAutoplay();
})();

/* ══════════════════════════════════════════
   12. CONTACT FORM
══════════════════════════════════════════ */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const fields = {
    name: { el: $('#name'), error: $('#nameError'), validate: v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.' },
    email: { el: $('#email'), error: $('#emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: $('#subject'), error: $('#subjectError'), validate: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.' },
    message: { el: $('#message'), error: $('#messageError'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' }
  };

  const submitBtn = $('#submitBtn');
  const formSuccess = $('#formSuccess');

  function validateField(key) {
    const field = fields[key];
    const msg = field.validate(field.el.value);
    field.error.textContent = msg;
    field.el.classList.toggle('error', !!msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) return;

    // Simulate submission
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('span').textContent = 'Send Message';
      formSuccess.classList.add('show');
      form.reset();
      Object.values(fields).forEach(f => f.el.classList.remove('error'));
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 2000);
  });
})();

/* ══════════════════════════════════════════
   13. SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
  window.scrollTo({ top: target.offsetTop - navHeight + 1, behavior: 'smooth' });
});

/* ══════════════════════════════════════════
   14. FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = $('#currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
