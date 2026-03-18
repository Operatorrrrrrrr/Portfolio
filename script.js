// =============================================================================
// EFFET TYPEWRITER
// Efface le texte d'un élément puis le retape lettre par lettre.
// =============================================================================

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

// Lancer au chargement de la page
typewriterEffect('typewriter-text', 50);


// =============================================================================
// ANIMATIONS AU SCROLL
// Ajoute la classe "visible" quand un élément .reveal entre dans le viewport.
// =============================================================================

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


// =============================================================================
// BOUTONS FLOTTANTS — APPARITION AU SCROLL
// Ajoute/retire une classe CSS quand une section devient visible.
// =============================================================================

// Surveille une section et ajoute/retire une classe sur un autre élément.
function observeSection(elementSelector, sectionId, className, options = {}) {
    const element = document.querySelector(elementSelector);
    const section = document.getElementById(sectionId);
    if (!element || !section) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            element.classList.toggle(className, entry.isIntersecting);
        });
    }, options);

    observer.observe(section);
}

observeSection('.btn-projets',    'projets', 'visible', { threshold: 0.6, rootMargin: '-10% 0px -10% 0px' });
observeSection('.btn-apropos',    'apropos', 'visible', { threshold: 0.3, rootMargin: '-20% 0px -15% 0px' });
observeSection('.btn-telecharger','apropos', 'visible', { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });


// =============================================================================
// NAVIGATION — LIEN ACTIF & MODE COMPACT
// =============================================================================

const sections = document.querySelectorAll('.section-pleine');
const navLinks = document.querySelectorAll('.nav-droite .lien-nav');
const nav      = document.querySelector('.nav-droite');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;

            // Met le lien correspondant en "actif"
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });

            // Mode compact (icônes) sur toutes les sections sauf Accueil
            nav.classList.toggle('compact', id !== 'accueil');
        }
    });
}, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

sections.forEach(section => navObserver.observe(section));

// Smooth scroll vers la section Projets
const projLink = document.querySelector('.nav-droite a[href="#projets"]');
if (projLink) {
    projLink.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('projets').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}


// =============================================================================
// SECTIONS DÉTAIL — OUVERTURE & FERMETURE ANIMÉE
// =============================================================================

// Ouvre une section détail et la fait défiler dans la vue.
function ouvrirSection(target, targetId) {
    const btn = document.querySelector(`[data-toggle="${targetId}"]`);

    target.style.display = 'flex';
    target.classList.remove('hidden');
    if (btn) btn.style.visibility = 'hidden';

    setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
}

// Ferme une section détail et revient à la section parente.
function fermerSection(target) {
    const parentId = target.id === 'detail-apropos' ? 'apropos' : 'projets';
    const parent   = document.getElementById(parentId);
    const btn      = document.querySelector(`[data-toggle="${target.id}"]`);

    target.classList.add('hidden');

    setTimeout(() => {
        target.style.display = 'none';
        if (parent) parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);

    if (btn) btn.style.visibility = 'visible';
}

// Bascule ouverture / fermeture selon l'état courant.
function toggleDetailSection(targetId) {
    const target   = document.getElementById(targetId);
    const estCache = target.style.display === 'none' || target.classList.contains('hidden');

    if (estCache) {
        ouvrirSection(target, targetId);
    } else {
        fermerSection(target);
    }
}

// Attache le toggle à tous les boutons data-toggle
document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        toggleDetailSection(btn.dataset.toggle);
    });
});


// =============================================================================
// CAROUSEL DE PROJETS
// =============================================================================

function initCarousel() {
    const track = document.querySelector('#detail-projets .carousel-track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.carte-projet'));
    const dots  = Array.from(document.querySelectorAll('#detail-projets .carousel-dot'));
    if (cards.length === 0) return;

    const total = cards.length;

    // Trouver la carte initialement active (définie dans le HTML)
    let current = cards.findIndex(c => c.dataset.carouselPos === 'active');
    if (current === -1) current = 0;

    // Verrou pour éviter les clics pendant une animation
    let isAnimating = false;

    // Calcule la position ('active', 'prev', 'next') d'une carte selon l'index courant.
    function getPos(cardIndex) {
        const diff = (cardIndex - current + total) % total;
        if (diff === 0) return 'active';
        if (diff === 1) return 'next';
        return 'prev';
    }

    // Met à jour les attributs data-carousel-pos et les points de navigation.
    function updatePositions() {
        cards.forEach((card, i) => {
            card.dataset.carouselPos = getPos(i);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    // Fait tourner le carousel vers un nouvel index.
    function goTo(newIndex) {
        if (isAnimating || newIndex === current) return;
        isAnimating = true;
        current = newIndex;
        updatePositions();
        // Durée calée sur la transition CSS (0.65s)
        setTimeout(() => { isAnimating = false; }, 680);
    }

    // Clic sur une carte latérale → aller à cette carte
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            const pos = card.dataset.carouselPos;
            if (pos === 'prev' || pos === 'next') goTo(i);
        });
    });

    // Clic sur un point de navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // Swipe tactile (gauche = suivant, droite = précédent)
    let touchStartX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
            const newIndex = delta < 0
                ? (current + 1) % total
                : (current - 1 + total) % total;
            goTo(newIndex);
        }
    }, { passive: true });

    // Initialiser les positions
    updatePositions();


    // -------------------------------------------------------------------------
    // ZOOM MODAL
    // Au clic sur la carte active, elle est déplacée dans <body> pour
    // échapper au contexte 3D du carousel (sinon position: fixed ne marche pas).
    // -------------------------------------------------------------------------

    // Créer le fond sombre une seule fois
    let backdrop = document.querySelector('.carte-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'carte-backdrop';
        document.body.appendChild(backdrop);
    }

    let carteAgrandie = null;  // carte actuellement ouverte en modal
    let ancreDOM      = null;  // commentaire HTML pour retrouver la position d'origine
    let positionSauvee = null; // data-carousel-pos sauvegardé

    function agrandirCarte(card) {
        if (carteAgrandie) return;

        // Sauvegarder la position dans le DOM et dans le carousel
        positionSauvee = card.dataset.carouselPos;
        ancreDOM = document.createComment('carte-anchor');
        card.parentNode.insertBefore(ancreDOM, card);

        // Déplacer la carte dans <body> (échappe au contexte 3D)
        document.body.appendChild(card);
        carteAgrandie = card;
        card.classList.add('expanded');

        // Afficher le fond sombre
        backdrop.classList.add('open');
        requestAnimationFrame(() => requestAnimationFrame(() => backdrop.classList.add('visible')));

        document.addEventListener('keydown', fermerAvecEchap);
    }

    function fermerCarte() {
        if (!carteAgrandie) return;
        const card = carteAgrandie;

        // Retirer la classe expanded
        card.classList.remove('expanded');

        // Remettre la carte à sa place d'origine dans le carousel
        ancreDOM.parentNode.insertBefore(card, ancreDOM);
        ancreDOM.remove();
        ancreDOM = null;

        // Restaurer la position carousel
        card.dataset.carouselPos = positionSauvee;
        positionSauvee = null;

        // Fermer le fond sombre
        backdrop.classList.remove('visible');
        backdrop.addEventListener('transitionend', function nettoyage() {
            backdrop.classList.remove('open');
            backdrop.removeEventListener('transitionend', nettoyage);
        });

        carteAgrandie = null;
        document.removeEventListener('keydown', fermerAvecEchap);
    }

    function fermerAvecEchap(e) {
        if (e.key === 'Escape') fermerCarte();
    }

    // Clic sur la carte active → agrandir
    // Clic sur la carte agrandie → fermer (sauf sur les éléments interactifs)
    cards.forEach(card => {
        card.addEventListener('click', e => {
            if (carteAgrandie === card) {
                const cibleInteractive = e.target.closest(
                    'button, a, input, select, textarea, [data-dir], #jeu, #snake-game, .snake-controls, .snake-control'
                );
                if (!cibleInteractive) fermerCarte();
                return;
            }
            if (!carteAgrandie && card.dataset.carouselPos === 'active') {
                agrandirCarte(card);
            }
        });
    });

    // Clic sur le fond sombre → fermer
    backdrop.addEventListener('click', fermerCarte);
}

// Lancer le carousel au chargement
initCarousel();