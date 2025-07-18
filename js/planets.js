import { CONFIG, PLANET_DATA, MOON_DATA } from './config.js';

/**
 * Classe pour gérer la création et l'animation des planètes
 */
export class PlanetSystem {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.planets = [];
        this.moonAngle = Math.random() * Math.PI * 2;
        this.moon = null;
        this.earth = null;
    }

    /**
     * Génère une texture procédurale pour une planète
     */
    generatePlanetTexture(planetData, index) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = CONFIG.TEXTURE.CANVAS_SIZE;
        const ctx = canvas.getContext('2d');

        // Gradient de base
        const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        gradient.addColorStop(0, `hsl(${index * 45}, 80%, 60%)`);
        gradient.addColorStop(1, `hsl(${index * 45}, 80%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.TEXTURE.CANVAS_SIZE, CONFIG.TEXTURE.CANVAS_SIZE);

        // Ajouter des détails de surface
        for (let i = 0; i < CONFIG.TEXTURE.PLANET_SPOTS; i++) {
            ctx.fillStyle = `hsla(${index * 45}, 80%, ${Math.random() * 100}%, ${Math.random() * 0.4})`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * CONFIG.TEXTURE.CANVAS_SIZE,
                Math.random() * CONFIG.TEXTURE.CANVAS_SIZE,
                Math.random() * 10,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Ajouter des bandes pour les géantes gazeuses
        const gasGiants = ["Jupiter", "Saturn", "Uranus", "Neptune"];
        if (gasGiants.includes(planetData.name)) {
            for (let i = 0; i < CONFIG.TEXTURE.RING_BANDS; i++) {
                ctx.fillStyle = `hsla(${index * 45}, 80%, 50%, ${CONFIG.TEXTURE.RING_OPACITY})`;
                ctx.fillRect(0, i * CONFIG.TEXTURE.RING_BAND_HEIGHT, CONFIG.TEXTURE.CANVAS_SIZE, CONFIG.TEXTURE.RING_BAND_HEIGHT / 2);
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Crée une planète avec ses propriétés
     */
    createPlanet(data, index) {
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const texture = this.generatePlanetTexture(data, index);
        
        const materialProps = {
            map: texture,
            color: data.color,
            emissive: data.emissive || 0x000000,
            emissiveIntensity: data.emissiveIntensity || 0,
            shininess: 25
        };

        const material = new THREE.MeshPhongMaterial(materialProps);
        const planet = new THREE.Mesh(geometry, material);

        // Ajouter les anneaux pour Saturne
        if (data.hasRings) {
            this.addRings(planet, data);
        }

        // Ajouter l'orbite
        if (data.orbitRadius > 0) {
            this.createOrbit(data.orbitRadius);
        }

        // Ajouter l'éclairage et les textures spéciales
        this.addSpecialEffects(planet, data);

        this.scene.add(planet);
        
        const planetObj = {
            mesh: planet,
            data: data,
            angle: Math.random() * Math.PI * 2
        };

        this.planets.push(planetObj);

        // Garder une référence à la Terre pour la Lune
        if (data.name === "Earth") {
            this.earth = planetObj;
        }

        return planetObj;
    }

    /**
     * Ajoute les anneaux à une planète
     */
    addRings(planet, data) {
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.2, 64);
        const ringTexture = this.loader.load(`assets/textures/${data.ringTexture}`);
        const ringMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            map: ringTexture
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
    }

    /**
     * Crée une orbite visible
     */
    createOrbit(orbitRadius) {
        const orbitGeometry = new THREE.TorusGeometry(orbitRadius, 1, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        this.scene.add(orbit);
    }

    /**
     * Ajoute des effets spéciaux (éclairage, textures réalistes)
     */
    addSpecialEffects(planet, data) {
        if (data.name === "Sun") {
            // Éclairage du soleil
            const sunLight = new THREE.PointLight(
                CONFIG.LIGHTING.SUN_COLOR,
                CONFIG.LIGHTING.SUN_INTENSITY,
                CONFIG.LIGHTING.SUN_DISTANCE
            );
            planet.add(sunLight);
        }

        // Appliquer les textures réalistes
        if (data.textureFile) {
            const texture = this.loader.load(`assets/textures/${data.textureFile}`);
            const glowGeometry = new THREE.SphereGeometry(data.radius * 1.2, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                opacity: 1,
                transparent: data.name === "Sun"
            });

            if (data.name === "Sun") {
                glowMaterial.color.setHex(0xffff00);
            }

            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            planet.add(glow);
        } else {
            // Éclairage général pour les autres planètes
            const planetLight = new THREE.PointLight(data.color, 0.5, data.radius * 5);
            planet.add(planetLight);
        }
    }

    /**
     * Crée la Lune en orbite autour de la Terre
     */
    createMoon() {
        if (!this.earth) return;

        const moonGeometry = new THREE.SphereGeometry(MOON_DATA.radius, 32, 32);
        const moonTexture = this.loader.load(`assets/textures/${MOON_DATA.textureFile}`);
        const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
        
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.scene.add(this.moon);

        this.planets.push({
            mesh: this.moon,
            data: MOON_DATA,
            angle: Math.random() * Math.PI * 2,
            orbitParent: this.earth.mesh
        });
    }

    /**
     * Initialise tous les planètes du système solaire
     */
    initializePlanets() {
        // Créer toutes les planètes
        PLANET_DATA.forEach((data, index) => {
            this.createPlanet(data, index);
        });

        // Créer la Lune
        this.createMoon();
    }

    /**
     * Met à jour les animations des planètes
     */
    updatePlanets() {
        this.planets.forEach(planet => {
            // Animation orbitale avec vitesses réalistes
            if (planet.data.orbitRadius > 0) {
                planet.angle += planet.data.orbitSpeed;
                planet.mesh.position.x = Math.cos(planet.angle) * planet.data.orbitRadius;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.data.orbitRadius;
            }

            // Rotation sur l'axe avec vitesses réalistes
            if (planet.data.rotationSpeed) {
                planet.mesh.rotation.y += planet.data.rotationSpeed;
            } else {
                // Fallback pour l'ancienne méthode si rotationSpeed n'est pas défini
                planet.mesh.rotation.y += 0.005 / (planet.data.orbitRadius || 1);
            }
        });

        // Animation spéciale pour la Lune
        if (this.moon && this.earth) {
            const earthPosition = this.earth.mesh.position;
            this.moonAngle += MOON_DATA.orbitSpeed;
            this.moon.position.x = earthPosition.x + Math.cos(this.moonAngle) * MOON_DATA.orbitRadius;
            this.moon.position.z = earthPosition.z + Math.sin(this.moonAngle) * MOON_DATA.orbitRadius;
            
            // Rotation réaliste de la Lune
            if (MOON_DATA.rotationSpeed) {
                this.moon.rotation.y += MOON_DATA.rotationSpeed;
            }
        }
    }

    /**
     * Retourne la liste des planètes
     */
    getPlanets() {
        return this.planets;
    }

    /**
     * Trouve une planète par nom
     */
    findPlanetByName(name) {
        return this.planets.find(p => p.data.name === name);
    }
}