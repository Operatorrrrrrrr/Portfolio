
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    let columns = 0;
    let drops = [];
    const fontSize = 14;
    const chars = '01';
    let animationId = null;
    let isRunning = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function animateMatrix() {
        if (!isRunning) return;
        drawMatrix();
        animationId = requestAnimationFrame(animateMatrix);
    }

    window.startMatrix = function() {
        if (isRunning) return;
        isRunning = true;
        canvas.classList.add('active');
        resizeCanvas();
        animateMatrix();
    };

    window.stopMatrix = function() {
        isRunning = false;
        canvas.classList.remove('active');
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
});


document.addEventListener('DOMContentLoaded', () => {
    const cartes = document.querySelectorAll('.carte-projet');
    
    cartes.forEach((carte, index) => {
        
        carte.style.opacity = '0';
        carte.style.transform = 'translateY(20px)';
        carte.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            carte.style.opacity = '1';
            carte.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartes = document.querySelectorAll('.carte-projet');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !modalBody || !closeBtn) {
        console.error("Erreur : Éléments de la modale manquants dans le HTML.");
        return;
    }

   
    cartes.forEach((carte, index) => {
        // Initialisation pour l'animation
        carte.style.opacity = '0';
        carte.style.transform = 'translateY(20px)';
        carte.style.transition = 'all 0.5s ease-out';
        
        // Curseur pointer pour indiquer que c'est cliquable
        carte.style.cursor = 'pointer';

        // Lancement de l'animation décalée
        setTimeout(() => {
            carte.style.opacity = '1';
            carte.style.transform = 'translateY(0)';
        }, 100 * index);

        
        carte.addEventListener('click', () => {
            // .trim() est crucial pour nettoyer le texte
            const titreCarte = carte.querySelector('h3').innerText.trim();
            
            // Recherche du contenu template correspondant dans le HTML
            const template = document.querySelector(`[data-project="${titreCarte}"]`);

            if (template) {
                // Injection du contenu HTML complet du template
                modalBody.innerHTML = template.innerHTML;
            } else {
              
                modalBody.innerHTML = `
                    <div class="modal-gabarit-simple">
                        <h2 class="modal-title">${titreCarte}</h2>
                        <div class="modal-placeholder-image">📷 Visuel à venir</div>
                        <p>Détails en cours de rédaction pour ce projet. Revenez bientôt !</p>
                        <a href="#" class="modal-link">Action bientôt disponible</a>
                    </div>
                `;
                console.warn(`Template HTML manquant pour le projet : "${titreCarte}"`);
            }

            // Affichage de la modale et blocage du scroll arrière
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
            
            // 🔥 MATRIX START - AJOUT ICI
            startMatrix();
        });
    });

  
    const fermerModale = () => {
        modal.style.display = "none";
        // Restauration du scroll de la page
        document.body.style.overflow = "auto";
        // Optionnel : vider le contenu pour repartir propre
        setTimeout(() => { modalBody.innerHTML = ''; }, 300);
        
        // 🔥 MATRIX STOP - AJOUT ICI
        stopMatrix();
    };

    closeBtn.addEventListener('click', fermerModale);

   
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            fermerModale();
        }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" && modal.style.display === "block") {
            fermerModale();
        }
    });
});
