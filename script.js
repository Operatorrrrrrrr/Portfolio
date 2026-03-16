// Effet typewriter simple
function typewriterEffect(elementId, speed = 50) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const text = element.textContent;
  element.textContent = '';
  let index = 0;
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Observer pour animations au scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('p, h2').forEach(el => el.style.opacity = '1');
    } else {
      entry.target.classList.remove('visible');
      entry.target.querySelectorAll('p, h2').forEach(el => el.style.opacity = '0');
    }
  });
}, { threshold: 0.2, rootMargin: '-200px 0px -200px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Lancer l'effet typewriter au chargement
typewriterEffect('typewriter-text', 50);

// Fonction utilitaire pour gérer les observateurs de sections
function observeSection(elementSelector, sectionId, className, options = {}) {
  const element = document.querySelector(elementSelector);
  const section = document.getElementById(sectionId);
  if (!element || !section) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    });
  }, options);
  
  observer.observe(section);
}

// Observer pour les boutons flottants
observeSection('.btn-projets', 'projets', 'visible', { threshold: 0.6, rootMargin: '-10% 0px -10% 0px' });
observeSection('.btn-apropos', 'apropos', 'visible', { threshold: 0.3, rootMargin: '-20% 0px -15% 0px' });
observeSection('.btn-telecharger', 'apropos', 'visible', { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

// Observer pour navigation active et compacte
const sections = document.querySelectorAll('.section-pleine');
const navLinks = document.querySelectorAll('.nav-droite .lien-nav');
const nav = document.querySelector('.nav-droite');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
      nav.classList.toggle('compact', id !== 'accueil');
    }
  });
}, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

sections.forEach(section => navObserver.observe(section));

// Lien Projets smooth scroll
const projLink = document.querySelector('.nav-droite a[href="#projets"]');
if (projLink) {
  projLink.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('projets').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// Gestion des sections détail
function toggleDetailSection(targetId) {
  const target = document.getElementById(targetId);
  const isHidden = target.style.display === 'none' || target.classList.contains('hidden');
  
  if (isHidden) {
    scheduleOpen(target, targetId);
  } else {
    scheduleClose(target);
  }
}

function scheduleOpen(target, targetId) {
  const parent = targetId === 'detail-apropos' ? 
    document.getElementById('apropos') : 
    document.getElementById('projets');
  const btn = document.querySelector(`[data-toggle="${targetId}"]`);
  
  target.style.display = 'flex';
  target.classList.remove('hidden');
  if (btn) btn.style.visibility = 'hidden';
  
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 250);
}

function scheduleClose(target) {
  const parent = target.id === 'detail-apropos' ? 
    document.getElementById('apropos') : 
    document.getElementById('projets');
  const btn = document.querySelector(`[data-toggle="${target.id}"]`);
  
  target.classList.add('hidden');
  setTimeout(() => {
    target.style.display = 'none';
    parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 400);
  if (btn) btn.style.visibility = 'visible';
}

document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    toggleDetailSection(btn.dataset.toggle);
  });
});

