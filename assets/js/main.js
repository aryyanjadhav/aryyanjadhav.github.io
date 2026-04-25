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
   THREE.JS — 3D NEURAL NETWORK
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

  // Group to hold the whole network so we can spin it
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  /* ---- Build the Neural Network ---- */
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x0044aa,
    emissiveIntensity: 0.5
  });
  
  const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const layers = [4, 6, 6, 4]; // Nodes per layer
  const layerSpacing = 1.2;
  const nodeSpacing = 0.8;
  const allNodes = [];

  // Create Nodes
  layers.forEach((nodeCount, layerIndex) => {
    const layerNodes = [];
    const xPos = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
    
    for (let i = 0; i < nodeCount; i++) {
      const yPos = (i - (nodeCount - 1) / 2) * nodeSpacing;
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(xPos, yPos, (Math.random() - 0.5) * 0.5); // Slight 3D stagger
      networkGroup.add(node);
      layerNodes.push(node);
    }
    allNodes.push(layerNodes);
  });

  // Create Synapses (Lines)
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x66aaff, 
    transparent: true, 
    opacity: 0.3 
  });

  for (let l = 0; l < allNodes.length - 1; l++) {
    const currentLayer = allNodes[l];
    const nextLayer = allNodes[l + 1];

    currentLayer.forEach(nodeA => {
      nextLayer.forEach(nodeB => {
        const points = [nodeA.position, nodeB.position];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMaterial);
        networkGroup.add(line);
      });
    });
  }

  /* ---- Lighting ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light1 = new THREE.PointLight(0x0099ff, 2, 20);
  light1.position.set(5, 5, 5);
  scene.add(light1);
  
  const light2 = new THREE.PointLight(0xff6600, 1, 20); // Warm accent
  light2.position.set(-5, -3, -5);
  scene.add(light2);

  camera.position.z = 5;

  /* ---- ORBIT CONTROLS (The Magic Interactivity) ---- */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 
  controls.dampingFactor = 0.05;
  controls.enableZoom = false; // Prevents page scroll getting stuck
  controls.autoRotate = true;  // Spins on its own
  controls.autoRotateSpeed = 1.2;

  /* ---- Animation loop ---- */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Pulse the glowing nodes
    nodeMaterial.emissiveIntensity = 0.5 + Math.sin(frame * 0.05) * 0.3;

    // Required for smooth damping and auto-rotation
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