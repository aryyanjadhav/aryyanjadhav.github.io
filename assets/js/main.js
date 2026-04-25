/* =============================
   DARK / LIGHT THEME
============================= */
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  document.body.classList.add(darkTheme);
  themeButton.classList.replace('bx-moon', 'bx-sun');
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  const isDark = document.body.classList.contains(darkTheme);
  themeButton.classList.replace(isDark ? 'bx-moon' : 'bx-sun', isDark ? 'bx-sun' : 'bx-moon');
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
   SKILL BARS ANIMATION
============================= */
const skillBars = document.querySelectorAll('.skills__bar');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.percent + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

/* =============================
   SWIPER PROJECTS
============================= */
const swiper = new Swiper('.swiper', {
  loop: true,
  spaceBetween: 24,
  grabCursor: true,
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    576: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
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
   THREE.JS — 3D HERO ELEMENT
============================= */
(function initThreeJS() {
  const container = document.getElementById('home-canvas');
  if (!container) return;

  const W = container.clientWidth;
  const H = container.clientHeight || 350;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Geometry — torus knot looks impressive
  const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 20);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    roughness: 0.2,
    metalness: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Particles / stars background
  const starGeo = new THREE.BufferGeometry();
  const starCount = 800;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 40;
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
  scene.add(new THREE.Points(starGeo, starMat));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x0077ff, 2, 20);
  pointLight.position.set(4, 4, 4);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0xff4400, 1, 20);
  pointLight2.position.set(-4, -2, -4);
  scene.add(pointLight2);

  camera.position.z = 4.5;

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.005 + mouseX * 0.008;
    mesh.rotation.x += 0.003 + mouseY * 0.004;
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler — works on ALL screen sizes including TV
  window.addEventListener('resize', () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight || 350;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });
})();

/* =============================
   SCROLL REVEAL ANIMATIONS
============================= */
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 300,
  reset: false,
});

sr.reveal('.home__data',       { origin: 'left' });
sr.reveal('.home__3d',         { origin: 'right', delay: 500 });
sr.reveal('.section__title');
sr.reveal('.section__subtitle', { delay: 200 });
sr.reveal('.about__img',       { origin: 'left' });
sr.reveal('.about__data',      { origin: 'right' });
sr.reveal('.skills__group',    { interval: 200 });
sr.reveal('.swiper-slide',     { interval: 100 });
sr.reveal('.contact__card',    { interval: 100 });
sr.reveal('.contact__form',    { origin: 'bottom' });

/* =============================
   EMAILJS CONTACT FORM
============================= */
emailjs.init('v3G--6Pdwv-v5hqvm'); // ← replace this

const contactForm    = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  emailjs.sendForm('service_l7atzep', 'template_rgcvaag', contactForm)
    .then(() => {
      contactMessage.textContent = '✅ Message sent! I\'ll reply soon.';
      contactMessage.style.color = 'green';
      setTimeout(() => contactMessage.textContent = '', 5000);
      contactForm.reset();
    })
    .catch(() => {
      contactMessage.textContent = '❌ Something went wrong. Try again.';
      contactMessage.style.color = 'red';
    });
});