import { CONFIG } from './config.js';

/**
 * Utilitaires pour l'application Space FortyThree
 */
export class Utils {
    /**
     * Crée un champ d'étoiles
     */
    static createStarField(scene) {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ 
            color: CONFIG.STARS.COLOR,
            size: 2.0,
            transparent: true,
            opacity: 1.0,
            sizeAttenuation: true
        });

        const starVertices = [];
        const starSizes = [];
        
        for (let i = 0; i < CONFIG.STARS.COUNT; i++) {
            const x = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
            const y = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
            const z = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
            starVertices.push(x, y, z);
            
            // Variation de taille des étoiles pour plus de réalisme
            starSizes.push(Math.random() * 3 + 1);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        return stars;
    }

    /**
     * Configure l'éclairage de la scène
     */
    static setupLighting(scene) {
        // Éclairage ambiant
        const ambientLight = new THREE.AmbientLight(
            CONFIG.LIGHTING.AMBIENT_COLOR,
            CONFIG.LIGHTING.AMBIENT_INTENSITY
        );
        scene.add(ambientLight);

        return { ambientLight };
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    static setupWindowResize(camera, renderer, cameraController, uiManager) {
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            if (cameraController) {
                cameraController.onWindowResize();
            }
            
            if (uiManager) {
                uiManager.onWindowResize();
            }
        };

        window.addEventListener('resize', onWindowResize);
        return onWindowResize;
    }

    /**
     * Calcule la distance entre deux objets 3D
     */
    static calculateDistance(obj1, obj2) {
        return obj1.position.distanceTo(obj2.position);
    }

    /**
     * Convertit des degrés en radians
     */
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convertit des radians en degrés
     */
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Génère un nombre aléatoire dans une plage
     */
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Effectue une interpolation linéaire
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Clamp une valeur entre min et max
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Génère un identifiant unique
     */
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Formatte un nombre avec des séparateurs de milliers
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Calcule la vélocité orbitale réaliste (approximation)
     */
    static calculateOrbitalVelocity(orbitRadius, centralMass = 1) {
        // Formule simplifiée: v = sqrt(GM/r)
        const G = 6.67430e-11; // Constante gravitationnelle (simplifiée)
        return Math.sqrt(G * centralMass / orbitRadius);
    }

    /**
     * Vérifie si un objet est visible dans la frustum de la caméra
     */
    static isObjectVisible(object, camera) {
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix, 
            camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(matrix);

        const box = new THREE.Box3().setFromObject(object);
        return frustum.intersectsBox(box);
    }

    /**
     * Crée un effet de particules
     */
    static createParticleEffect(scene, position, count = 100, color = 0xffffff) {
        const particles = new THREE.BufferGeometry();
        const particleCount = count;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 10;

            velocities[i * 3] = (Math.random() - 0.5) * 2;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 2,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        return particleSystem;
    }

    /**
     * Débogage: affiche les informations de performance
     */
    static createPerformanceMonitor() {
        const stats = {
            fps: 0,
            frameTime: 0,
            lastTime: performance.now(),
            frameCount: 0
        };

        const updateStats = () => {
            const now = performance.now();
            stats.frameTime = now - stats.lastTime;
            stats.lastTime = now;
            stats.frameCount++;

            if (stats.frameCount % 60 === 0) {
                stats.fps = Math.round(1000 / stats.frameTime);
                console.log(`FPS: ${stats.fps}, Frame Time: ${stats.frameTime.toFixed(2)}ms`);
            }
        };

        return updateStats;
    }

    /**
     * Vérifie les capacités WebGL du navigateur
     */
    static checkWebGLCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            console.error('WebGL not supported');
            return false;
        }

        const capabilities = {
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
            maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
            maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
        };

        console.log('WebGL Capabilities:', capabilities);
        return capabilities;
    }
}