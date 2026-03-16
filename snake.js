const jeu = document.getElementById("jeu");
const boutonLancer = document.getElementById("lancerJeu");
const scoreElement = document.getElementById("score");

if (jeu && boutonLancer && scoreElement) {
  const taille = 20;
  const cases = [];
  let compteurTentatives = 0;
  let score = 0;
  let serpent = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
  let direction = { x: 1, y: 0 };
  let nourriture = { x: 5, y: 5 };
  let jeuLance = false;
  let intervalId = null;

  // création de la grille
  for (let i = 0; i < taille * taille; i++) {
    const cell = document.createElement("div");
    cell.classList.add("case");
    jeu.appendChild(cell);
    cases.push(cell);
  }

  function mettreAJourScore() {
    scoreElement.textContent = "Score : " + score;
  }

  function afficher() {
    for (let i = 0; i < cases.length; i++) {
      cases[i].className = "case";
    }

    const indexNourriture = nourriture.y * taille + nourriture.x;
    cases[indexNourriture].classList.add("nourriture");

    for (let i = 0; i < serpent.length; i++) {
      const index = serpent[i].y * taille + serpent[i].x;
      cases[index].classList.add(i === 0 ? "teteSerpent" : "serpent");
    }
  }

  document.addEventListener("keydown", event => {
    if (!jeuLance) return; // on ne réagit qu'en jeu
  
    const key = event.key;
  
    if (key === "ArrowUp" && direction.y !== 1) {
      event.preventDefault();
      direction = { x: 0, y: -1 };
    }
    if (key === "ArrowDown" && direction.y !== -1) {
      event.preventDefault();
      direction = { x: 0, y: 1 };
    }
    if (key === "ArrowLeft" && direction.x !== 1) {
      event.preventDefault();
      direction = { x: -1, y: 0 };
    }
    if (key === "ArrowRight" && direction.x !== -1) {
      event.preventDefault();
      direction = { x: 1, y: 0 };
    }
  });

  const mobileButtons = document.querySelectorAll(".snake-control");

  mobileButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!jeuLance) return;

      const dir = btn.dataset.dir;

      if (dir === "up" && direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      if (dir === "down" && direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      if (dir === "left" && direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      if (dir === "right" && direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
    });
  });

  function resetJeu(stopTimer = false) {
    serpent = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nourriture = {
      x: Math.floor(Math.random() * taille),
      y: Math.floor(Math.random() * taille)
    };
    score = 0;
    mettreAJourScore();
    afficher();

    if (stopTimer && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    jeuLance = false;
  }

  function deplacer() {
    const tete = {
      x: serpent[0].x + direction.x,
      y: serpent[0].y + direction.y
    };

    const collisionMur =
      tete.x < 0 || tete.x >= taille || tete.y < 0 || tete.y >= taille;
    const collisionCorps = serpent.some(
      partie => partie.x === tete.x && partie.y === tete.y
    );

    if (collisionMur || collisionCorps) {
    
      compteurTentatives++;
      console.log("Nb de tentatives :", compteurTentatives);
      resetJeu(true);
      return;
    }

    serpent.unshift(tete);

    if (tete.x === nourriture.x && tete.y === nourriture.y) {
      nourriture = {
        x: Math.floor(Math.random() * taille),
        y: Math.floor(Math.random() * taille)
      };
      score++;
      mettreAJourScore();

      // redirection après 3 points
      if (score >= 3) {
        alert("Bravo ! Vous avez atteint 3 points, je vous montre tous mes projets.");
        resetJeu(true);                // remet le jeu à zéro et stoppe le timer
        window.location.href = "/projets/projet.html";
        return;                        // on arrête la fonction ici
      }
    } else {
      serpent.pop();
    }

    afficher();
  }

  boutonLancer.addEventListener("click", () => {
    if (!jeuLance) {
      compteurTentatives++;
      console.log("Nb de tentatives :", compteurTentatives);
      jeuLance = true;
      mettreAJourScore();
      afficher();
      intervalId = setInterval(deplacer, 300);
    }
  });

  window.addEventListener("pagehide", () => {
    resetJeu(true);
  });
}