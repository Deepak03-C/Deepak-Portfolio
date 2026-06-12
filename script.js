/* ============================================================
   DEEPAK KUMAR C — Portfolio JS
   ============================================================ */

// ── Framer LogoPreloader ───────────────────────────────────
(function () {
  const screen = document.getElementById('loadingScreen');
  const logo   = document.getElementById('lpLogo');
  if (!screen || !logo) return;

  // Phase 1: slide logo up into view (50ms matches Framer's init delay)
  setTimeout(() => logo.classList.add('lp-in'), 50);

  const startExit = () => {
    logo.classList.remove('lp-in');
    logo.classList.add('lp-out');
    // Overlay fades out after the 700ms logo-out transition completes
    setTimeout(() => screen.classList.add('lp-done'), 700);
  };

  // Hold for 2 s after logo arrives, or wait for full page load — whichever is later
  const HOLD = 2000;
  const t0 = performance.now();
  let exited = false;
  const doExit = () => { if (!exited) { exited = true; startExit(); } };

  window.addEventListener('load', () => {
    const elapsed = performance.now() - t0;
    setTimeout(doExit, Math.max(0, HOLD - elapsed));
  });
  setTimeout(doExit, HOLD + 1500); // hard cap: 3.5 s
}());

// ── Theme Toggle ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const applyTheme = theme => {
  body.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
};

// Restore saved preference (default: dark)
applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const next = body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(next);
});

// ── AOS Init ──────────────────────────────────────────────
AOS.init({
  duration: 800,
  once: true,
  offset: 50,
  easing: 'ease-out-sine'
});

// ── Navbar scroll effect ───────────────────────────────────
const mainNav = document.getElementById('mainNav');
const onScroll = () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Active nav link highlight ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

// ── Smooth scroll for nav links ────────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        const collapse = document.getElementById('navMenu');
        if (collapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(collapse)?.hide();
        }
      }
    }
  });
});

// ── Typed role animation ───────────────────────────────────
const roles = [
  'Software Engineer',
  'QA Automation Expert',
  'Fintech Specialist',
  'ISO 20022 Validator',
  'Full Stack Developer'
];

let roleIndex = 0, charIndex = 0, isDeleting = false;
const roleEl = document.getElementById('roleText');

const typeRole = () => {
  const current = roles[roleIndex];
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  roleEl.textContent = current.slice(0, charIndex);

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeRole, delay);
};
typeRole();

// ── Contact form handler ───────────────────────────────────
// ── Contact form — web3forms ──────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const btn    = document.getElementById('formSubmitBtn');
  const result = document.getElementById('formResult');

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending…';
    result.style.display = 'none';

    const data = new FormData(contactForm);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        result.style.display = 'block';
        result.innerHTML = '<div class="cf-success"><i class="fas fa-check-circle me-2"></i>Message sent! I\'ll get back to you soon.</div>';
        contactForm.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      result.style.display = 'block';
      result.innerHTML = '<div class="cf-error"><i class="fas fa-exclamation-circle me-2"></i>Something went wrong. Please try again.</div>';
    }

    btn.disabled = false;
    btn.innerHTML = originalHTML;
    setTimeout(() => { result.style.display = 'none'; }, 6000);
  });
}

// ── Skill card tilt effect ─────────────────────────────────
document.querySelectorAll('.skill-card, .project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * 4;
    const rotY = ((x - cx) / cx) * -4;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Scroll-triggered counter animation ───────────────────
const counters = document.querySelectorAll('.hc-stat-num');
const animatedCounters = new Set();

const animateCounter = el => {
  const target = el.textContent.replace('+', '');
  const isFloat = target.includes('.');
  const end = parseFloat(target);
  const duration = 1200;
  const start = performance.now();

  const tick = now => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (ease * end).toFixed(1)
      : Math.floor(ease * end);
    el.textContent = value + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animatedCounters.has(entry.target)) {
      animatedCounters.add(entry.target);
      const suffix = entry.target.textContent.includes('+') ? '+' : '';
      entry.target.dataset.suffix = suffix;
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ── Glowing cursor follower (subtle) ─────────────────────
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 40%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.7s ease, top 0.7s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ── Framer Progress Bar — timeline scroll fill ─────────────
// Mirrors the component's scroll-section trigger logic:
// fill grows from 0 → 100% as #experience travels through the viewport.
(function () {
  const fill    = document.getElementById('tlProgressFill');
  const section = document.getElementById('experience');
  if (!fill || !section) return;

  function update() {
    const { top, height } = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 % when section top reaches the top of the viewport
    // 100 % when the section bottom reaches the bottom of the viewport
    // scrollable = height - vh (the distance from "section top at viewport top"
    //              to "section bottom at viewport bottom")
    const scrollable = height - vh;
    const pct = scrollable > 0
      ? Math.max(0, Math.min(1, -top / scrollable))
      : Math.max(0, Math.min(1, (vh - top) / height)); // fallback if section fits in viewport
    fill.style.height = (pct * 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // set initial value on load
}());

// ── Showcase Card (hero profile) toggle ────────────────────
const hcScCard   = document.getElementById('hcScCard');
const hcScToggle = document.getElementById('hcScToggle');
const hcScLabel  = hcScToggle?.querySelector('.hc-sc-label');
let hcCountersRun = false;

if (hcScCard && hcScToggle) {
  hcScToggle.addEventListener('click', () => {
    const isOpen = hcScCard.classList.toggle('hc-open');
    if (hcScLabel) hcScLabel.textContent = isOpen ? 'Close' : 'View Profile';
    // Run counter animation once when card first opens
    if (isOpen && !hcCountersRun) {
      hcCountersRun = true;
      hcScCard.querySelectorAll('.hc-stat-num').forEach(el => {
        if (!animatedCounters.has(el)) {
          animatedCounters.add(el);
          const suffix = el.textContent.includes('+') ? '+' : '';
          el.dataset.suffix = suffix;
          animateCounter(el);
        }
      });
    }
  });
}

// ── Framer Glow Card — border beam on all cards ────────────
document.querySelectorAll(
  '.skill-card, .project-card, .cert-card, .about-info-card, .edu-card, .hc-sc-card, .timeline-card'
).forEach(card => {
  const overlay = document.createElement('div');
  overlay.className = 'glow-border-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  card.appendChild(overlay);

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
    card.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--glow-x', '-9999px');
    card.style.setProperty('--glow-y', '-9999px');
  });
});
