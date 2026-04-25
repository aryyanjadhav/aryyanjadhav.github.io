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
  loop: true,
  spaceBetween: 24,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
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
   THREE.JS — 3D HERO ELEMENT
   Neural network / brain motif
   fitting for an AI engineer
============================= */
(function initThreeJS() {
  const container = document.getElementById('home-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth  || 400;
  const H = container.clientHeight || 350;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  /* ---- Main shape: Icosahedron (brain-like complexity) ---- */
  const geometry = new THREE.IcosahedronGeometry(1.4, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* ---- Wireframe overlay ---- */
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x66aaff,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const wireMesh = new THREE.Mesh(geometry, wireMat);
  wireMesh.scale.setScalar(1.02);
  scene.add(wireMesh);

  /* ---- Floating particle nodes (neural network dots) ---- */
  const particleCount = 120;
  const pPositions    = new Float32Array(particleCount * 3);
  const velocities    = [];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 2.2 + Math.random() * 1.2;

    pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = r * Math.cos(phi);

    velocities.push({
      x: (Math.random() - 0.5) * 0.004,
      y: (Math.random() - 0.5) * 0.004,
      z: (Math.random() - 0.5) * 0.004,
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions.slice(), 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: 0.06,
    transparent: true,
    opacity: 0.9,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ---- Lighting ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const light1 = new THREE.PointLight(0x0099ff, 3, 20);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xff6600, 1.5, 20);
  light2.position.set(-5, -3, -5);
  scene.add(light2);

 camera.position.z = 5;

  /* ---- ADDED: Orbit Controls for 3D Dragging ---- */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Adds smooth deceleration
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;   // Disabled so it doesn't interrupt page scrolling
  controls.autoRotate = true;    // Rotates slowly when the user isn't touching it
  controls.autoRotateSpeed = 1.0;


  /* ---- Animation loop ---- */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // REQUIRED: Update controls for damping and auto-rotation
    controls.update();

    // Smooth mouse follow
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    mesh.rotation.y    += 0.004 + currentX * 0.006;
    mesh.rotation.x    += 0.002 + currentY * 0.003;
    wireMesh.rotation.y = mesh.rotation.y;
    wireMesh.rotation.x = mesh.rotation.x;

    // Animate particles
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce back if too far
      const dist = Math.sqrt(
        pos[i*3]**2 + pos[i*3+1]**2 + pos[i*3+2]**2
      );
      if (dist > 4.5 || dist < 2) {
        velocities[i].x *= -1;
        velocities[i].y *= -1;
        velocities[i].z *= -1;
      }
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Pulse the main mesh scale slightly
    const pulse = 1 + Math.sin(frame * 0.03) * 0.015;
    mesh.scale.setScalar(pulse);

    renderer.render(scene, camera);
  }
  animate();

  /* ---- Responsive resize (all screens including TV) ---- */
  window.addEventListener('resize', () => {
    const newW = container.clientWidth  || 400;
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

sr.reveal('.home__data',             { origin: 'left' });
sr.reveal('.home__3d',               { origin: 'right', delay: 500 });
sr.reveal('.section__title');
sr.reveal('.section__subtitle',      { delay: 200 });
sr.reveal('.about__img',             { origin: 'left' });
sr.reveal('.about__data',            { origin: 'right' });
sr.reveal('.about__edu-item',        { interval: 150 });
sr.reveal('.skills__group',          { interval: 200 });
sr.reveal('.skills__icon-item',      { interval: 80 });
sr.reveal('.experience__item',       { interval: 200, origin: 'left' });
sr.reveal('.swiper-slide',           { interval: 100 });
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