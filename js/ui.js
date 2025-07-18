import { CONFIG } from './config.js';

/**
 * Classe pour gérer l'interface utilisateur
 */
export class UIManager {
    constructor() {
        this.dialogueIndex = 0;
        this.dialogueElement = document.getElementById('dialogueText');
        this.planetInfoElement = document.getElementById('planetInfo');
        this.isTyping = false;
        
        this.setupVideoControls();
        this.startDialogue();
    }

    /**
     * Configure les contrôles vidéo
     */
    setupVideoControls() {
        const video = document.getElementById('introVideo');
        const playButton = document.getElementById('playButton');
        const skipButton = document.getElementById('skipButton');
        const playButtonContainer = document.getElementById('playButtonContainer');

        // Configuration initiale
        video.volume = 1;
        video.pause();

        // Événement bouton play
        playButton.addEventListener('click', () => {
            video.muted = false;
            video.play();
            playButtonContainer.style.display = 'none';
        });

        // Événement bouton skip
        skipButton.addEventListener('click', () => {
            this.skipIntro();
        });

        // Événement fin de vidéo
        video.addEventListener('ended', () => {
            this.skipIntro();
        });
    }

    /**
     * Passe l'intro et démarre l'animation
     */
    skipIntro() {
        const video = document.getElementById('introVideo');
        const skipButton = document.getElementById('skipButton');
        const playButtonContainer = document.getElementById('playButtonContainer');

        video.pause();
        video.style.display = 'none';
        skipButton.style.display = 'none';
        playButtonContainer.style.display = 'none';

        // Déclencher l'événement personnalisé pour démarrer l'animation
        const startEvent = new CustomEvent('startSolarSystem');
        document.dispatchEvent(startEvent);
    }

    /**
     * Démarre l'animation du dialogue
     */
    startDialogue() {
        this.dialogueIndex = 0;
        this.dialogueElement.innerHTML = '';
        this.typeDialogue();
    }

    /**
     * Anime le texte du dialogue lettre par lettre
     */
    typeDialogue() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const text = CONFIG.UI.DIALOGUE_TEXT;
        
        const typeNextChar = () => {
            if (this.dialogueIndex < text.length) {
                this.dialogueElement.innerHTML += text.charAt(this.dialogueIndex);
                this.dialogueIndex++;
                setTimeout(typeNextChar, CONFIG.UI.TYPING_SPEED);
            } else {
                this.isTyping = false;
            }
        };

        typeNextChar();
    }

    /**
     * Affiche les informations d'une planète
     */
    showPlanetInfo(planetData) {
        this.planetInfoElement.innerHTML = `
            <h2>${planetData.name}</h2>
            <p>${planetData.description}</p>
            <div class="planet-stats">
                <p><strong>Radius:</strong> ${planetData.radius} units</p>
                <p><strong>Distance:</strong> ${planetData.realDistance || 'N/A'} AU</p>
                <p><strong>Orbital Period:</strong> ${planetData.realOrbitalPeriod || 'N/A'} Earth years</p>
                <p><strong>Rotation Period:</strong> ${Math.abs(planetData.realRotationPeriod || 0).toFixed(1)} hours</p>
                ${planetData.eccentricity ? `<p><strong>Orbit Eccentricity:</strong> ${planetData.eccentricity.toFixed(4)} ${planetData.eccentricity > 0.1 ? '(elliptical)' : '(nearly circular)'}</p>` : ''}
            </div>
        `;
        
        this.planetInfoElement.style.display = 'block';
        // Ajouter la classe visible avec un léger délai pour l'animation
        setTimeout(() => {
            this.planetInfoElement.classList.add('visible');
        }, 50);
    }

    /**
     * Cache les informations de la planète
     */
    hidePlanetInfo() {
        this.planetInfoElement.classList.remove('visible');
        // Cacher complètement après l'animation
        setTimeout(() => {
            this.planetInfoElement.style.display = 'none';
        }, 300);
    }

    /**
     * Met à jour le texte d'information générale
     */
    updateInfoText(text) {
        const infoElement = document.getElementById('info');
        if (infoElement) {
            infoElement.innerHTML = text;
        }
    }

    /**
     * Affiche un message temporaire
     */
    showTemporaryMessage(message, duration = 3000) {
        const messageElement = document.createElement('div');
        messageElement.className = 'temporary-message';
        messageElement.innerHTML = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid white;
            z-index: 1000;
            animation: fadeInOut ${duration}ms ease-in-out;
        `;

        document.body.appendChild(messageElement);

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }

    /**
     * Crée un indicateur de chargement
     */
    showLoadingIndicator(message = "Loading...") {
        const loadingElement = document.createElement('div');
        loadingElement.id = 'loading-indicator';
        loadingElement.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Orbitron', sans-serif;
            color: white;
        `;

        document.body.appendChild(loadingElement);
        return loadingElement;
    }

    /**
     * Supprime l'indicateur de chargement
     */
    hideLoadingIndicator() {
        const loadingElement = document.getElementById('loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        // Ajuster les éléments UI si nécessaire
        // Cette méthode peut être étendue selon les besoins
    }

    /**
     * Bascule l'affichage des contrôles
     */
    toggleControls() {
        const infoElement = document.getElementById('info');
        if (infoElement) {
            infoElement.style.display = infoElement.style.display === 'none' ? 'block' : 'none';
        }
    }

    /**
     * Met à jour l'affichage des informations de navigation
     */
    updateNavigationInfo(cameraController) {
        const infoText = `
            <span class="highlight">WASD</span> to move<br>
            <span class="highlight">Arrows</span> to look around<br>
            <span class="highlight">Space/Shift</span> to move up/down<br>
            <span class="highlight">Click</span> planets for information<br>
            ${cameraController.zoomTarget ? '<span class="highlight">ESC</span> to return to free camera' : ''}
        `;
        this.updateInfoText(infoText);
    }
}