class Person {
    constructor(prenom, nom) {
        this.prenom = prenom;
        this.nom = nom;
    }

    get fullName() {
        return `${this.prenom} ${this.nom}`;
    }
}

class Player extends Person {
    #container;

    constructor(prenom, nom, birthDate, biography, image) {
        super(prenom, nom);
        this.birthDate = birthDate;
        this.biography = biography;
        this.image = image;
        this.#container = null;
    }

    getParsedDate() {
        if (!this.birthDate) return null;
        const parts = this.birthDate.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return null;
    }

    add(parentElement) {
        const flipCard = document.createElement('div');
        flipCard.className = 'flip-card';

        const inner = document.createElement('div');
        inner.className = 'flip-card-inner';

        // Face avant
        const front = document.createElement('div');
        front.className = 'flip-card-front';
        const img = document.createElement('img');
        img.src = `${this.image}`;
        img.alt = this.fullName;
        const name = document.createElement('h2');
        name.textContent = this.fullName;
        front.appendChild(img);
        front.appendChild(name);

        // Face arrière
        const back = document.createElement('div');
        back.className = 'flip-card-back';
        const bioPara = document.createElement('p');
        bioPara.className = 'bio';
        bioPara.innerHTML = `<strong>Bio :</strong> ${this.biography}`;
        const birthPara = document.createElement('p');
        birthPara.className = 'birthdate';
        const dateObj = this.getParsedDate();
        const formattedDate = dateObj ? dateObj.toLocaleDateString('fr-FR') : this.birthDate;
        birthPara.innerHTML = `<strong>Naissance :</strong> ${formattedDate}`;
        back.appendChild(bioPara);
        back.appendChild(birthPara);

        inner.appendChild(front);
        inner.appendChild(back);
        flipCard.appendChild(inner);

        parentElement.appendChild(flipCard);
        this.#container = flipCard;
    }
}

async function loadPlayers() {
    const url = 'players.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const playersData = await response.json();

        const container = document.getElementById('players-container');
        playersData.forEach(data => {
            const player = new Player(
                data.prenom,
                data.nom,
                data.birthDate,
                data.biography,
                data.image
            );
            player.add(container);
        });
    } catch (error) {
        console.error('Erreur lors du chargement :', error);
        const container = document.getElementById('players-container');
        container.innerHTML = '<p style="color:red;">Impossible de charger les joueurs.</p>';
    }
}

loadPlayers();