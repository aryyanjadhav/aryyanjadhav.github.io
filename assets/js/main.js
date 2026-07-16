/* =============================
   DEVELOPER EASTER EGG
============================= */
console.log(
  "%c🤖 System Initialized: Aryan's Portfolio%c\n\nLooking under the hood? I build Spiking Neural Networks, autonomous navigation systems, and clean code. Let's build something great together. \n\nReach out: aryanjadhav.de@gmail.com",
  "color: #AF52DE; font-size: 16px; font-weight: bold; font-family: -apple-system, sans-serif;",
  "color: inherit; font-size: 12px; font-family: -apple-system, sans-serif;"
);

/* =============================
   DARK / LIGHT THEME
============================= */
const themeButton = document.getElementById('theme-button');
const darkTheme   = 'dark-theme';

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  document.body.classList.add(darkTheme);
  themeButton.classList.replace('bx-moon', 'bx-sun');
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  const isDark = document.body.classList.contains(darkTheme);
  themeButton.classList.replace(
    isDark ? 'bx-moon' : 'bx-sun',
    isDark ? 'bx-sun'  : 'bx-moon'
  );
  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
});

/* =============================
   NAV MENU TOGGLE
============================= */
const navMenu   = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose  = document.getElementById('nav-close');

navToggle?.addEventListener('click', () => navMenu.classList.add('show-menu'));
navClose?.addEventListener('click',  () => navMenu.classList.remove('show-menu'));
document.querySelectorAll('.nav__link').forEach(link =>
  link.addEventListener('click', () => navMenu.classList.remove('show-menu'))
);

/* =============================
   ACTIVE NAV LINK ON SCROLL
============================= */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;
  sections.forEach(current => {
    const sectionTop    = current.offsetTop - 58;
    const sectionHeight = current.offsetHeight;
    const sectionId     = current.getAttribute('id');
    const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active-link');
    } else {
      navLink?.classList.remove('active-link');
    }
  });
}
window.addEventListener('scroll', scrollActive);

/* =============================
   SCROLL UP BUTTON
============================= */
function scrollUp() {
  const scrollUpEl = document.getElementById('scroll-up');
  window.scrollY >= 350
    ? scrollUpEl.classList.add('show-scroll')
    : scrollUpEl.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);



/* =============================
   SWIPER — PROJECTS SLIDER
============================= */
const swiper = new Swiper('.swiper', {
  loop: false, // Scrollbars work better when loop is false
  spaceBetween: 24,
  grabCursor: true,
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
  breakpoints: {
    576:  { slidesPerView: 1 },
    768:  { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

/* =============================
   3D TILT ON PROJECT CARDS
============================= */
document.querySelectorAll('.project__card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 18;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -18;
    card.style.transform = `rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});


/* =============================
   SCROLL REVEAL ANIMATIONS
============================= */
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 1000, /* Sped up from 2500ms to 1000ms */
  delay: 100,     /* Reduced delay for snappier loading */
  reset: false,
});

sr.reveal('.home__data',             { origin: 'left' });
sr.reveal('.home__img',               { origin: 'right', delay: 200 });
sr.reveal('.section__title');
sr.reveal('.section__subtitle',      { delay: 100 });
sr.reveal('.about__img',             { origin: 'left' });
sr.reveal('.about__data',            { origin: 'right' });
sr.reveal('.about__edu-item',        { interval: 100 });
sr.reveal('.skills__card', { interval: 150 });
sr.reveal('.experience__item',       { interval: 150, origin: 'left' });
// Add this inside your ScrollReveal section
sr.reveal('.project__card', { interval: 150 });
/* NOTE: .swiper-slide has been intentionally removed from here so they don't disappear */
sr.reveal('.awards__card',           { origin: 'bottom' });
sr.reveal('.contact__card',          { interval: 100 });
sr.reveal('.contact__form',          { origin: 'bottom' });

/* =============================
   EMAILJS CONTACT FORM
============================= */
// 1. Paste YOUR Public Key here
emailjs.init('v3G--6Pdwv-v5hqvm'); 

const contactForm    = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  // 2. Paste YOUR Service ID and Template ID here
  emailjs.sendForm('service_fsbk9nh', 'template_89ru57u', contactForm)
    .then(() => {
      contactMessage.textContent  = '✅ Message sent! I\'ll reply soon.';
      contactMessage.style.color  = 'green';
      setTimeout(() => contactMessage.textContent = '', 5000);
      contactForm.reset();
    })
    .catch(() => {
      contactMessage.textContent = '❌ Something went wrong. Try again.';
      contactMessage.style.color = 'red';
    });
});
/* =============================
   ADDED: PLAYABLE AI NEURAL ARTWORK
============================= */
const canvas = document.getElementById('ai-neural-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const homeSection = document.getElementById('home');

  let width, height;
  let particles = [];
  // Slightly reduced radius so it doesn't grab the whole screen
  let mouse = { x: -1000, y: -1000, radius: 180 };

  function resizeCanvas() {
    width = homeSection.offsetWidth;
    height = homeSection.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Neuron {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Made base movement slightly slower for a calmer feel
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.baseRadius = Math.random() * 2 + 1;
      this.radius = this.baseRadius;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse/Touch Interaction Physics
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        // Create an equilibrium zone: pull from afar, push away if too close
        if (dist > 80) {
            // Outer zone: VERY gentle attraction + swirl
            this.x += dx * 0.002;
            this.y += dy * 0.002;
            this.x -= dy * 0.0015; // Swirl
            this.y += dx * 0.0015; // Swirl
        } else {
            // Inner zone (Forcefield): Gently push away to prevent dense clumping
            this.x -= dx * 0.004;
            this.y -= dy * 0.004;
        }
      }
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(79, 156, 249, 0.7)';
      ctx.fill();
    }
  }

  function initNeurons() {
    particles = [];
    // Slightly reduced total node count for a cleaner look
    let numNeurons = (width * height) / 13000;
    for (let i = 0; i < numNeurons; i++) {
      particles.push(new Neuron());
    }
  }
  initNeurons();

  function animateNetwork() {
    requestAnimationFrame(animateNetwork);
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains('dark-theme');
    const rgbLine = isDark ? '255, 255, 255' : '79, 156, 249';
    const rgbActive = '175, 82, 222'; // Purple accent

    particles.forEach((p, index) => {
      p.update();
      p.draw(isDark);

      for (let j = index; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Reduced connection distance slightly to prevent line spaghetti
        if (dist < 110) {
          ctx.beginPath();
          let opacity = 1 - (dist / 110);

          let mDist1 = Math.sqrt(Math.pow(mouse.x - p.x, 2) + Math.pow(mouse.y - p.y, 2));
          let mDist2 = Math.sqrt(Math.pow(mouse.x - p2.x, 2) + Math.pow(mouse.y - p2.y, 2));

          if (mDist1 < mouse.radius || mDist2 < mouse.radius) {
              ctx.strokeStyle = `rgba(${rgbActive}, ${opacity + 0.2})`;
              ctx.lineWidth = 1.2;
          } else {
              ctx.strokeStyle = `rgba(${rgbLine}, ${opacity * 0.3})`;
              ctx.lineWidth = 0.8;
          }

          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
  }
  animateNetwork();

  // Mouse Events
  homeSection.addEventListener('mousemove', (e) => {
    let rect = homeSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  homeSection.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch Events (Mobile)
  homeSection.addEventListener('touchstart', (e) => {
    let rect = homeSection.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, {passive: true});

  homeSection.addEventListener('touchmove', (e) => {
    let rect = homeSection.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, {passive: true});

  window.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
}