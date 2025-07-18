import { CONFIG } from './config.js';
import { PlanetSystem } from './planets.js';
import { CameraController } from './camera.js';
import { UIManager } from './ui.js';
import { InteractionManager } from './interaction.js';
import { Utils } from './utils.js';

/**
 * Classe principale de l'application Space FortyThree
 */
class SpaceFortyThree {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.loader = null;
        
        this.planetSystem = null;
        this.cameraController = null;
        this.uiManager = null;
        this.interactionManager = null;
        
        this.animationId = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialise l'application
     */
    init() {
        // Vérifier les capacités WebGL
        if (!Utils.checkWebGLCapabilities()) {
            console.error('WebGL non supporté');
            return;
        }

        // Initialiser l'interface utilisateur
        this.uiManager = new UIManager();
        
        // Écouter l'événement de démarrage du système solaire
        document.addEventListener('startSolarSystem', () => {
            this.startSolarSystemAnimation();
        });
    }

    /**
     * Démarre l'animation du système solaire
     */
    startSolarSystemAnimation() {
        if (this.isInitialized) return;
        
        this.setupThreeJS();
        this.setupLighting();
        this.setupStars();
        this.setupCamera();
        this.setupPlanets();
        this.setupInteractions();
        this.setupEventListeners();
        
        this.isInitialized = true;
        this.animate();
    }

    /**
     * Configure Three.js (scène, caméra, renderer)
     */
    setupThreeJS() {
        // Créer la scène
        this.scene = new THREE.Scene();
        
        // Créer la caméra
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.RENDERER.FIELD_OF_VIEW,
            window.innerWidth / window.innerHeight,
            CONFIG.RENDERER.NEAR_PLANE,
            CONFIG.RENDERER.FAR_PLANE
        );
        
        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: CONFIG.RENDERER.ANTIALIAS 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.body.appendChild(this.renderer.domElement);
        
        // Créer le loader de textures
        this.loader = new THREE.TextureLoader();
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLighting() {
        Utils.setupLighting(this.scene);
    }

    /**
     * Crée le champ d'étoiles
     */
    setupStars() {
        Utils.createStarField(this.scene);
    }

    /**
     * Configure le contrôleur de caméra
     */
    setupCamera() {
        this.cameraController = new CameraController(this.camera, this.renderer);
    }

    /**
     * Configure le système de planètes
     */
    setupPlanets() {
        this.planetSystem = new PlanetSystem(this.scene, this.loader);
        this.planetSystem.initializePlanets();
    }

    /**
     * Configure le gestionnaire d'interactions
     */
    setupInteractions() {
        this.interactionManager = new InteractionManager(
            this.camera,
            this.scene,
            this.cameraController,
            this.uiManager
        );
        this.interactionManager.setPlanets(this.planetSystem.getPlanets());
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        Utils.setupWindowResize(
            this.camera,
            this.renderer,
            this.cameraController,
            this.uiManager
        );
        
        // Écouter les changements de fullscreen
        document.addEventListener('fullscreenchange', () => {
            this.onFullscreenChange();
        });
    }

    /**
     * Gère les changements de mode plein écran
     */
    onFullscreenChange() {
        setTimeout(() => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
    }

    /**
     * Boucle d'animation principale
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Mettre à jour les systèmes
        this.update();
        
        // Rendu
        this.render();
    }

    /**
     * Met à jour tous les systèmes
     */
    update() {
        if (this.cameraController) {
            this.cameraController.update();
        }
        
        if (this.planetSystem) {
            this.planetSystem.updatePlanets();
        }
        
        // Mettre à jour les informations de navigation
        if (this.uiManager && this.cameraController) {
            this.uiManager.updateNavigationInfo(this.cameraController);
        }
    }

    /**
     * Effectue le rendu de la scène
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Nettoie les ressources
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.interactionManager) {
            this.interactionManager.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Nettoyer la scène
        while (this.scene && this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);
            
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    }

    /**
     * Redémarre l'application
     */
    restart() {
        this.dispose();
        this.isInitialized = false;
        this.init();
    }

    /**
     * Retourne les informations de debug
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            planetsCount: this.planetSystem ? this.planetSystem.getPlanets().length : 0,
            cameraPosition: this.camera ? this.camera.position : null,
            selectedPlanet: this.interactionManager ? this.interactionManager.getSelectedPlanet() : null,
            rendererInfo: this.renderer ? this.renderer.info : null
        };
    }
}

// Démarrer l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Exposer l'application globalement pour le débogage
    window.spaceFortyThree = new SpaceFortyThree();
    
    // Exposer des utilitaires pour le débogage
    window.debugUtils = {
        getAppInfo: () => window.spaceFortyThree.getDebugInfo(),
        restart: () => window.spaceFortyThree.restart(),
        config: CONFIG
    };
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur dans l\'application:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse rejetée:', event.reason);
});