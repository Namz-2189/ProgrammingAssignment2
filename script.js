/* =======================================
   PORTFOLIO — script.js
   Handles: nav scroll, mobile menu,
            work filter, scroll reveal
   ======================================= */

/* ---- Navbar: add .scrolled class on scroll ---- */
const nav = document.getElementById('nav');

function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // animate bars
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    bars[1].style.cssText = 'opacity:0';
    bars[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    bars.forEach(b => (b.style.cssText = ''));
  }
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(b => (b.style.cssText = ''));
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav__link[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= top && scrollY < top + height) {
      link.style.color = 'var(--clr-accent-2)';
    } else {
      link.style.color = '';
    }
  });
}
window.addEventListener('scroll', highlightNavLink, { passive: true });

/* ---- Work filter ---- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('visible'));
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- Scroll reveal (lightweight IntersectionObserver) ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings inside the same grid
        const delay = getSiblingIndex(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function getSiblingIndex(el) {
  let index = 0;
  let prev  = el.previousElementSibling;
  while (prev) { index++; prev = prev.previousElementSibling; }
  return index;
}

document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

/* ---- Smooth counter animation for hero stats ---- */
function animateCounter(el, target, duration = 1200) {
  const start    = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(startVal + (target - startVal) * eased) + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numbers = entry.target.querySelectorAll('.stat__number');
      const targets = [5, 40, 20];
      numbers.forEach((el, i) => animateCounter(el, targets[i]));
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- Typing effect for hero subtitle ---- */
const subtitle   = document.querySelector('.hero__subtitle');
const roles      = ['Full-Stack Developer', 'UI/UX Designer', 'Cloud Architect', 'Open Source Contributor'];
let   roleIndex  = 0;
let   charIndex  = 0;
let   isDeleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  subtitle.textContent = currentRole.slice(0, charIndex);

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800; // pause before deleting
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}

// Start typing after a short delay
setTimeout(typeRole, 1200);

/* ---- Prevent layout shift from font loading ---- */
document.fonts.ready.then(() => document.body.classList.add('fonts-loaded'));
