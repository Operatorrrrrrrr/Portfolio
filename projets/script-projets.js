document.addEventListener('DOMContentLoaded', () => {
    const cartes = document.querySelectorAll('.carte-projet');
    
    cartes.forEach((carte, index) => {
        // Apparition décalée pour chaque carte
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

    // --- Animation d'entrée et Initialisation des cartes ---
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

        // --- Gestion du Clic pour ouverture modale ---
        carte.addEventListener('click', () => {
            // .trim() est crucial pour nettoyer le texte
            const titreCarte = carte.querySelector('h3').innerText.trim();
            
            // Recherche du contenu template correspondant dans le HTML
            const template = document.querySelector(`[data-project="${titreCarte}"]`);

            if (template) {
                // Injection du contenu HTML complet du template
                modalBody.innerHTML = template.innerHTML;
            } else {
                // Contenu de secours si le template est manquant
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
        });
    });

    // --- Fonctions de Fermeture ---
    const fermerModale = () => {
        modal.style.display = "none";
        // Restauration du scroll de la page
        document.body.style.overflow = "auto";
        // Optionnel : vider le contenu pour repartir propre
        setTimeout(() => { modalBody.innerHTML = ''; }, 300);
    };

    // Clic sur le bouton 'X'
    closeBtn.addEventListener('click', fermerModale);

    // Clic en dehors de la fenêtre de la modale
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