import { CONFIG } from './config.js';

/**
 * Gestionnaire des interactions utilisateur (clics, sélections, etc.)
 */
export class InteractionManager {
    constructor(camera, scene, cameraController, uiManager) {
        this.camera = camera;
        this.scene = scene;
        this.cameraController = cameraController;
        this.uiManager = uiManager;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.planets = [];
        this.selectedPlanet = null;
        
        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        document.addEventListener('click', (event) => this.onClick(event));
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('dblclick', (event) => this.onDoubleClick(event));
    }

    /**
     * Définit la liste des planètes interactives
     */
    setPlanets(planets) {
        this.planets = planets;
    }

    /**
     * Gère les clics de souris
     */
    onClick(event) {
        // Empêcher l'interaction si la caméra est verrouillée
        if (this.cameraController.isLocked) return;

        this.updateMousePosition(event);
        
        // Configurer le raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Trouver les intersections avec les planètes
        const planetMeshes = this.planets.map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const clickedPlanet = this.planets.find(p => p.mesh === intersects[0].object);
            if (clickedPlanet) {
                this.selectPlanet(clickedPlanet);
            }
        } else {
            this.deselectPlanet();
        }
    }

    /**
     * Gère le mouvement de la souris
     */
    onMouseMove(event) {
        this.updateMousePosition(event);
        
        // Mise à jour du hover si nécessaire
        if (!this.cameraController.isLocked) {
            this.updateHover();
        }
    }

    /**
     * Gère les touches du clavier
     */
    onKeyDown(event) {
        switch (event.code) {
            case 'Escape':
                this.deselectPlanet();
                break;
            case 'KeyH':
                this.toggleHelp();
                break;
            case 'KeyI':
                this.toggleUI();
                break;
            case 'KeyR':
                this.resetCamera();
                break;
            case 'KeyF':
                this.toggleFullscreen();
                break;
        }
    }

    /**
     * Gère les double-clics
     */
    onDoubleClick(event) {
        if (this.selectedPlanet) {
            this.focusOnPlanet(this.selectedPlanet);
        }
    }

    /**
     * Met à jour la position de la souris
     */
    updateMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    /**
     * Met à jour l'effet de hover
     */
    updateHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const planetMeshes = this.planets.map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        // Réinitialiser tous les effets de hover
        this.planets.forEach(planet => {
            if (planet.mesh.material.emissive) {
                planet.mesh.material.emissive.setHex(planet.data.emissive || 0x000000);
            }
        });
        
        // Appliquer l'effet de hover à la planète survolée
        if (intersects.length > 0) {
            const hoveredPlanet = this.planets.find(p => p.mesh === intersects[0].object);
            if (hoveredPlanet && hoveredPlanet.mesh.material.emissive) {
                hoveredPlanet.mesh.material.emissive.setHex(0x444444);
            }
            
            // Changer le curseur
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    /**
     * Sélectionne une planète
     */
    selectPlanet(planet) {
        this.selectedPlanet = planet;
        
        // Afficher les informations de la planète
        this.uiManager.showPlanetInfo(planet.data);
        
        // Définir la cible de zoom
        this.cameraController.setZoomTarget(planet);
    }

    /**
     * Désélectionne la planète actuelle
     */
    deselectPlanet() {
        if (this.selectedPlanet) {
            this.selectedPlanet = null;
        }
        
        // Cacher les informations de la planète
        this.uiManager.hidePlanetInfo();
        
        // Supprimer la cible de zoom
        this.cameraController.clearZoomTarget();
    }


    /**
     * Focus sur une planète avec animation
     */
    focusOnPlanet(planet) {
        const targetPosition = planet.mesh.position.clone();
        const distance = planet.data.radius * 3;
        
        // Calculer la position optimale de la caméra
        const cameraPosition = targetPosition.clone();
        cameraPosition.y += distance;
        cameraPosition.z += distance;
        
        // Animation fluide vers la position
        const startPosition = this.camera.position.clone();
        const startTime = performance.now();
        const duration = 2000; // 2 secondes
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolation avec easing
            const easedProgress = this.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, cameraPosition, easedProgress);
            this.camera.lookAt(targetPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Fonction d'easing cubic
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Bascule l'affichage de l'aide
     */
    toggleHelp() {
        const helpText = `
            <h3>Controls:</h3>
            <span class="highlight">WASD/Arrows</span> - Move camera<br>
            <span class="highlight">Space/Shift</span> - Move up/down<br>
            <span class="highlight">Click</span> - Select planet<br>
            <span class="highlight">Double-click</span> - Focus on planet<br>
            <span class="highlight">ESC</span> - Deselect/Return to free camera<br>
            <span class="highlight">H</span> - Toggle this help<br>
            <span class="highlight">I</span> - Toggle UI<br>
            <span class="highlight">R</span> - Reset camera<br>
            <span class="highlight">F</span> - Toggle fullscreen
        `;
        
        this.uiManager.showTemporaryMessage(helpText, 5000);
    }

    /**
     * Bascule l'affichage de l'interface utilisateur
     */
    toggleUI() {
        this.uiManager.toggleControls();
    }

    /**
     * Remet la caméra à sa position initiale
     */
    resetCamera() {
        this.deselectPlanet();
        
        const targetPosition = new THREE.Vector3(
            CONFIG.CAMERA.INITIAL_POSITION.x,
            CONFIG.CAMERA.INITIAL_POSITION.y,
            CONFIG.CAMERA.INITIAL_POSITION.z
        );
        
        // Animation vers la position initiale
        const startPosition = this.camera.position.clone();
        const startTime = performance.now();
        const duration = 1500;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
            this.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Bascule le mode plein écran
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /**
     * Retourne la planète actuellement sélectionnée
     */
    getSelectedPlanet() {
        return this.selectedPlanet;
    }

    /**
     * Nettoie les ressources
     */
    dispose() {
        document.removeEventListener('click', this.onClick);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('dblclick', this.onDoubleClick);
    }
}