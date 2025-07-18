import { CONFIG } from './config.js';

/**
 * Classe pour gérer les contrôles et animations de la caméra
 */
export class CameraController {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.zoomTarget = null;
        
        // État des contrôles
        this.controls = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            lookUp: false,
            lookDown: false,
            lookLeft: false,
            lookRight: false
        };

        // Paramètres de mouvement
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.pitch = 0;
        this.yaw = 0;
        this.isLocked = false;

        // État d'animation
        this.initialZoomIn = true;
        this.initialZoomPosition = new THREE.Vector3(
            CONFIG.CAMERA.ZOOM_POSITION.x,
            CONFIG.CAMERA.ZOOM_POSITION.y,
            CONFIG.CAMERA.ZOOM_POSITION.z
        );

        this.initializeControls();
        this.setupInitialPosition();
    }

    /**
     * Configure la position initiale de la caméra
     */
    setupInitialPosition() {
        this.camera.position.copy(this.initialZoomPosition);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Initialise les contrôles clavier et souris
     */
    initializeControls() {
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
    }

    /**
     * Gère les événements de touche pressée
     */
    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                this.controls.moveForward = true;
                break;
            case 'KeyS':
                this.controls.moveBackward = true;
                break;
            case 'KeyA':
                this.controls.moveLeft = true;
                break;
            case 'KeyD':
                this.controls.moveRight = true;
                break;
            case 'ArrowUp':
                this.controls.lookUp = true;
                break;
            case 'ArrowDown':
                this.controls.lookDown = true;
                break;
            case 'ArrowLeft':
                this.controls.lookLeft = true;
                break;
            case 'ArrowRight':
                this.controls.lookRight = true;
                break;
            case 'Space':
                this.controls.moveUp = true;
                event.preventDefault();
                break;
            case 'ShiftLeft':
                this.controls.moveDown = true;
                break;
        }
    }

    /**
     * Gère les événements de touche relâchée
     */
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.controls.moveForward = false;
                break;
            case 'KeyS':
                this.controls.moveBackward = false;
                break;
            case 'KeyA':
                this.controls.moveLeft = false;
                break;
            case 'KeyD':
                this.controls.moveRight = false;
                break;
            case 'ArrowUp':
                this.controls.lookUp = false;
                break;
            case 'ArrowDown':
                this.controls.lookDown = false;
                break;
            case 'ArrowLeft':
                this.controls.lookLeft = false;
                break;
            case 'ArrowRight':
                this.controls.lookRight = false;
                break;
            case 'Space':
                this.controls.moveUp = false;
                break;
            case 'ShiftLeft':
                this.controls.moveDown = false;
                break;
        }
    }

    /**
     * Gère les mouvements de souris
     */
    onMouseMove(event) {
        if (!this.isLocked) {
            // Mode navigation libre
            this.mouse = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            };
            return;
        }

        // Mode FPS (pointer lock)
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.yaw -= movementX * CONFIG.CAMERA.MOUSE_SENSITIVITY;
        this.pitch -= movementY * CONFIG.CAMERA.MOUSE_SENSITIVITY;

        // Limiter la rotation verticale
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
    }

    /**
     * Gère les changements de verrouillage du pointeur
     */
    onPointerLockChange() {
        this.isLocked = document.pointerLockElement === this.renderer.domElement;
    }

    /**
     * Calcule la distance de zoom appropriée pour un objet
     */
    calculateZoomDistance(radius, name) {
        if (name === "Moon") {
            return CONFIG.UI.MOON_ZOOM_DISTANCE;
        }
        return Math.max(CONFIG.UI.ZOOM_BASE_DISTANCE, radius * 10);
    }

    /**
     * Définit une cible de zoom
     */
    setZoomTarget(target) {
        this.zoomTarget = target;
        if (target) {
            this.zoomTarget.zoomDistance = this.calculateZoomDistance(
                target.data.radius,
                target.data.name
            );
        }
    }

    /**
     * Supprime la cible de zoom
     */
    clearZoomTarget() {
        this.zoomTarget = null;
    }

    /**
     * Met à jour la caméra (appelé à chaque frame)
     */
    update() {
        this.updateInitialZoom();
        this.updateMovement();
        this.updateZoom();
    }

    /**
     * Met à jour l'animation de zoom initial
     */
    updateInitialZoom() {
        if (this.initialZoomIn) {
            // Vérifier si l'utilisateur bouge activement
            const isUserMoving = this.controls.moveForward || this.controls.moveBackward || 
                               this.controls.moveLeft || this.controls.moveRight || 
                               this.controls.moveUp || this.controls.moveDown ||
                               this.controls.lookUp || this.controls.lookDown ||
                               this.controls.lookLeft || this.controls.lookRight;
            
            // Si l'utilisateur bouge, arrêter définitivement l'animation initiale
            if (isUserMoving) {
                this.initialZoomIn = false;
                return;
            }
            
            const targetPosition = new THREE.Vector3(
                CONFIG.CAMERA.INITIAL_POSITION.x,
                CONFIG.CAMERA.INITIAL_POSITION.y,
                CONFIG.CAMERA.INITIAL_POSITION.z
            );
            
            this.camera.position.lerp(targetPosition, CONFIG.CAMERA.LERP_SPEED);

            if (this.camera.position.distanceTo(targetPosition) < 10) {
                this.initialZoomIn = false;
            }
        }
    }

    /**
     * Met à jour le mouvement de la caméra
     */
    updateMovement() {
        // Appliquer l'amortissement
        this.velocity.x *= CONFIG.CAMERA.VELOCITY_DAMPING;
        this.velocity.y *= CONFIG.CAMERA.VELOCITY_DAMPING;
        this.velocity.z *= CONFIG.CAMERA.VELOCITY_DAMPING;

        // Calculer la direction de mouvement - WASD seulement
        this.direction.z = Number(this.controls.moveForward) - Number(this.controls.moveBackward);
        this.direction.x = Number(this.controls.moveRight) - Number(this.controls.moveLeft);
        this.direction.y = Number(this.controls.moveUp) - Number(this.controls.moveDown);
        this.direction.normalize();

        // Appliquer la vitesse pour WASD
        if (this.controls.moveForward || this.controls.moveBackward) {
            this.velocity.z -= this.direction.z * CONFIG.CAMERA.MOVEMENT_SPEED;
        }
        if (this.controls.moveLeft || this.controls.moveRight) {
            this.velocity.x -= this.direction.x * CONFIG.CAMERA.MOVEMENT_SPEED;
        }
        if (this.controls.moveUp || this.controls.moveDown) {
            this.velocity.y += this.direction.y * CONFIG.CAMERA.MOVEMENT_SPEED;
        }

        // Contrôles de rotation avec les flèches directionnelles
        const rotationSpeed = 0.03;
        if (this.controls.lookUp) {
            this.pitch += rotationSpeed;
        }
        if (this.controls.lookDown) {
            this.pitch -= rotationSpeed;
        }
        if (this.controls.lookLeft) {
            this.yaw += rotationSpeed;
        }
        if (this.controls.lookRight) {
            this.yaw -= rotationSpeed;
        }

        // Limiter la rotation verticale
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

        // Appliquer la rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.x = this.pitch;
        this.camera.rotation.y = this.yaw;

        // Calculer le mouvement dans l'espace world
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        
        this.camera.position.add(forward.multiplyScalar(-this.velocity.z));
        this.camera.position.add(right.multiplyScalar(-this.velocity.x));
        this.camera.position.y += this.velocity.y;
    }

    /**
     * Met à jour le zoom vers la cible
     */
    updateZoom() {
        if (this.zoomTarget) {
            // Vérifier si l'utilisateur bouge activement (WASD + Space/Shift seulement)
            const isMoving = this.controls.moveForward || this.controls.moveBackward || 
                           this.controls.moveLeft || this.controls.moveRight || 
                           this.controls.moveUp || this.controls.moveDown;
            
            // Si l'utilisateur bouge, sortir du mode zoom
            if (isMoving) {
                this.clearZoomTarget();
                return;
            }
            
            const targetPosition = this.zoomTarget.mesh.position.clone();
            targetPosition.y += 100;
            
            this.camera.position.lerp(targetPosition, CONFIG.CAMERA.ZOOM_LERP_SPEED);
            this.camera.lookAt(targetPosition);
        }
    }

    /**
     * Redimensionne la caméra lors du changement de taille de fenêtre
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Retourne la position actuelle de la souris (pour le raycasting)
     */
    getMousePosition() {
        return this.mouse || { x: 0, y: 0 };
    }
}