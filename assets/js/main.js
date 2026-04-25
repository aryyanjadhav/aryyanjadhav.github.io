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
   THREE.JS — QUANTUM AI CORE
============================= */
(function initThreeJS() {
  const container = document.getElementById('home-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth || 400;
  const H = container.clientHeight || 350;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Group to hold the core structure
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  /* ---- Inner Matrix (The Brain) ---- */
  const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerCore);

  /* ---- Orbital Data Rings ---- */
  const rings = [];
  const ringColors = [0x00aaff, 0x0055ff, 0x0033aa];
  
  for(let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.4 + (i * 0.3), 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: ringColors[i],
      emissive: ringColors[i],
      emissiveIntensity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    // Offset their starting rotations so they intersect beautifully
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    coreGroup.add(ring);
    rings.push(ring);
  }

  /* ---- Ambient Particle Cloud (Data Points) ---- */
  const particleCount = 150;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pVel = [];

  for(let i = 0; i < particleCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 8; // X
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 8; // Y
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 8; // Z
    
    pVel.push({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    });
  }
  
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: 0.05,
    transparent: true,
    opacity: 0.7
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ---- Lighting ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  
  const light1 = new THREE.PointLight(0x0099ff, 2, 20);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x00ffff, 1, 20);
  light2.position.set(-5, -3, -5);
  scene.add(light2);

  camera.position.z = 5;

  /* ---- Orbit Controls ---- */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 
  controls.dampingFactor = 0.05;
  controls.enableZoom = false; 
  controls.autoRotate = false; // We will handle rotation manually for more complex movement

  /* ---- Animation loop ---- */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // 1. Rotate the inner core matrix
    innerCore.rotation.y += 0.005;
    innerCore.rotation.x += 0.002;

    // 2. Pulse the inner core
    const pulse = 1 + Math.sin(frame * 0.05) * 0.1;
    innerCore.scale.setScalar(pulse);

    // 3. Rotate the data rings on different axes
    rings[0].rotation.x += 0.01;
    rings[1].rotation.y -= 0.008;
    rings[2].rotation.z += 0.012;

    // 4. Slowly rotate the entire core group
    coreGroup.rotation.y += 0.002;
    coreGroup.rotation.z += 0.001;

    // 5. Float the ambient data particles
    const positions = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     += pVel[i].x;
      positions[i * 3 + 1] += pVel[i].y;
      positions[i * 3 + 2] += pVel[i].z;

      // Keep them enclosed in an invisible bounding box
      if (Math.abs(positions[i * 3]) > 4) pVel[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 4) pVel[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 4) pVel[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  /* ---- Responsive resize ---- */
  window.addEventListener('resize', () => {
    const newW = container.clientWidth || 400;
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
  duration: 1000, /* Sped up from 2500ms to 1000ms */
  delay: 100,     /* Reduced delay for snappier loading */
  reset: false,
});

sr.reveal('.home__data',             { origin: 'left' });
sr.reveal('.home__3d',               { origin: 'right', delay: 200 });
sr.reveal('.section__title');
sr.reveal('.section__subtitle',      { delay: 100 });
sr.reveal('.about__img',             { origin: 'left' });
sr.reveal('.about__data',            { origin: 'right' });
sr.reveal('.about__edu-item',        { interval: 100 });
sr.reveal('.skills__group',          { interval: 150 });
sr.reveal('.skills__icon-item',      { interval: 50 });
sr.reveal('.experience__item',       { interval: 150, origin: 'left' });
/* NOTE: .swiper-slide has been intentionally removed from here so they don't disappear */
sr.reveal('.awards__card',           { origin: 'bottom' });
sr.reveal('.contact__card',          { interval: 100 });
sr.reveal('.contact__form',          { origin: 'bottom' });

/* =============================
   EMAILJS CONTACT FORM
============================= */
emailjs.init('v3G--6Pdwv-v5hqvm'); // ← Replace with your EmailJS public key

const contactForm    = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  emailjs.sendForm('service_l7atzep', 'template_rgcvaag', contactForm)
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