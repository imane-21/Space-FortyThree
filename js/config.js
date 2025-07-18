/**
 * Configuration et constantes pour l'application Space FortyThree
 */

export const CONFIG = {
    // Paramètres de rendu
    RENDERER: {
        ANTIALIAS: true,
        FIELD_OF_VIEW: 75,
        NEAR_PLANE: 0.1,
        FAR_PLANE: 50000
    },

    // Paramètres de la caméra
    CAMERA: {
        INITIAL_POSITION: { x: 0, y: 1000, z: 8000 },
        ZOOM_POSITION: { x: 0, y: 1000, z: 50000 },
        MOUSE_SENSITIVITY: 0.002,
        MOVEMENT_SPEED: 10.0,
        VELOCITY_DAMPING: 0.9,
        LERP_SPEED: 0.01,
        ZOOM_LERP_SPEED: 0.05
    },

    // Paramètres des étoiles
    STARS: {
        COUNT: 15000,
        SPREAD: 50000,
        COLOR: 0xffffff
    },

    // Paramètres d'éclairage
    LIGHTING: {
        AMBIENT_COLOR: 0x404040,
        AMBIENT_INTENSITY: 1,
        SUN_COLOR: 0xffffff,
        SUN_INTENSITY: 2,
        SUN_DISTANCE: 15000
    },

    // Paramètres d'interface
    UI: {
        DIALOGUE_TEXT: "Go explore the Solar System !",
        TYPING_SPEED: 50,
        ZOOM_BASE_DISTANCE: 1000,
        MOON_ZOOM_DISTANCE: 1000
    },

    // Paramètres de texture
    TEXTURE: {
        CANVAS_SIZE: 1024,
        PLANET_SPOTS: 5000,
        RING_OPACITY: 0.2,
        RING_BANDS: 15,
        RING_BAND_HEIGHT: 34
    }
};

/**
 * Données scientifiques réalistes pour le système solaire
 */
const REAL_ASTRONOMICAL_DATA = {
    // Distances réelles en UA (Unités Astronomiques)
    distances: {
        Mercury: 0.39,
        Venus: 0.72,
        Earth: 1.00,
        Mars: 1.52,
        Jupiter: 5.20,
        Saturn: 9.54,
        Uranus: 19.18,
        Neptune: 30.06
    },
    // Périodes orbitales en années terrestres
    orbitalPeriods: {
        Mercury: 0.24,
        Venus: 0.62,
        Earth: 1.00,
        Mars: 1.88,
        Jupiter: 11.86,
        Saturn: 29.46,
        Uranus: 84.01,
        Neptune: 164.8
    },
    // Périodes de rotation en heures terrestres
    rotationPeriods: {
        Sun: 609.12, // 25.38 jours
        Mercury: 1407.6, // 58.6 jours
        Venus: -5832.5, // 243 jours (rétrograde)
        Earth: 23.93,
        Mars: 24.62,
        Jupiter: 9.93,
        Saturn: 10.66,
        Uranus: -17.24, // rétrograde
        Neptune: 16.11
    },
    // Excentricité des orbites (0 = cercle parfait, proche de 1 = très elliptique)
    eccentricity: {
        Mercury: 0.2056,  // Très elliptique
        Venus: 0.0068,    // Presque circulaire
        Earth: 0.0167,    // Presque circulaire
        Mars: 0.0934,     // Modérément elliptique
        Jupiter: 0.0484,  // Légèrement elliptique
        Saturn: 0.0539,   // Légèrement elliptique
        Uranus: 0.0473,   // Légèrement elliptique
        Neptune: 0.0086   // Presque circulaire
    }
};

/**
 * Calcule la vitesse orbitale selon les lois de Kepler
 */
function calculateOrbitalSpeed(distance, period) {
    // Formule simplifiée: vitesse = 2π * distance / période
    // Ajustée pour l'animation (facteur d'échelle)
    const baseSpeed = (2 * Math.PI * distance) / period;
    return baseSpeed * 0.0001; // Facteur d'échelle pour l'animation
}

/**
 * Calcule la vitesse de rotation
 */
function calculateRotationSpeed(rotationPeriod) {
    // Plus la période est longue, plus la rotation est lente
    const baseSpeed = 2 * Math.PI / Math.abs(rotationPeriod);
    return baseSpeed * 0.01; // Facteur d'échelle pour l'animation
}

/**
 * Convertit les distances réelles en distances d'affichage
 */
function scaleDistance(realDistance) {
    // Échelle plus réaliste pour les distances relatives
    const baseDistance = 500;
    // Utiliser une échelle qui respecte les proportions relatives
    return baseDistance + (realDistance * 1200);
}

/**
 * Données des planètes du système solaire avec données scientifiques réalistes
 */
export const PLANET_DATA = [
    {
        name: "Sun",
        radius: 500,
        orbitRadius: 0,
        orbitSpeed: 0,
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Sun),
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 1,
        textureFile: "suntexture.jpg",
        realDistance: 0,
        realOrbitalPeriod: 0,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Sun,
        description: `
            <strong>The center of the solar system</strong><br>
            The Sun is a star that serves as the central point of the solar system, containing about 99.86% of the system's total mass.<br><br>
            
            <strong>Rotation period</strong><br>
            The Sun rotates on its axis approximately every 25.38 Earth days at the equator.<br><br>
            
            <strong>Nuclear fusion</strong><br>
            The Sun generates energy through nuclear fusion, converting hydrogen into helium in its core, which produces vast amounts of energy and light.<br><br>
            
            <strong>Aging star</strong><br>
            The Sun is approximately 4.6 billion years old and is expected to continue its current phase for about another 5 billion years before evolving into a red giant.
        `
    },
    {
        name: "Mercury",
        radius: 60,
        orbitRadius: 968, // 0.39 * 1200 + 500 = 968
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Mercury, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Mercury),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Mercury),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Mercury,
        color: 0x888888,
        textureFile: "mercuretexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Mercury,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Mercury,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Mercury,
        description: `
            <strong>Closest planet to the Sun</strong><br>
            Mercury orbits the Sun every 87.97 Earth days at an average distance of 0.39 AU.<br><br>
            
            <strong>Slow rotation</strong><br>
            A single day on Mercury lasts 58.6 Earth days, while it takes only 87.97 days to orbit the Sun.<br><br>
            
            <strong>Extreme temperatures</strong><br>
            Temperatures can reach 430°C during the day and drop to -180°C at night, resulting in one of the most extreme temperature ranges in the solar system.<br><br>
            
            <strong>No atmosphere</strong><br>
            Mercury has no substantial atmosphere, only a thin exosphere composed of hydrogen and helium.
        `
    },
    {
        name: "Venus",
        radius: 105,
        orbitRadius: 1364, // 0.72 * 1200 + 500 = 1364
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Venus, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Venus),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Venus),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Venus,
        color: 0xe6e6e6,
        textureFile: "venustexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Venus,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Venus,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Venus,
        description: `
            <strong>Earth's twin</strong><br>
            Venus orbits the Sun every 224.7 Earth days at an average distance of 0.72 AU.<br><br>
            
            <strong>Retrograde rotation</strong><br>
            Venus rotates backwards (retrograde) with a day lasting 243 Earth days - longer than its year!<br><br>
            
            <strong>Extreme greenhouse effect</strong><br>
            Surface temperatures reach 460°C due to a runaway greenhouse effect from its thick CO₂ atmosphere.<br><br>
            
            <strong>High atmospheric pressure</strong><br>
            The atmospheric pressure is about 92 times greater than Earth's, similar to being nearly a kilometer underwater.
        `
    },
    {
        name: "Earth",
        radius: 120,
        orbitRadius: 1700, // 1.00 * 1200 + 500 = 1700
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Earth, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Earth),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Earth),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Earth,
        color: 0x2233ff,
        textureFile: "earthtexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Earth,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Earth,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Earth,
        description: `
            <strong>Our home planet</strong><br>
            Earth orbits the Sun every 365.25 days at exactly 1 AU (149.6 million km) from the Sun.<br><br>
            
            <strong>Perfect day length</strong><br>
            Earth rotates on its axis every 23.93 hours, giving us our familiar day-night cycle.<br><br>
            
            <strong>Liquid water</strong><br>
            About 71% of Earth's surface is covered by water, making it the only known planet with liquid water.<br><br>
            
            <strong>Seasons</strong><br>
            The tilt of Earth's axis (23.5 degrees) results in distinct seasons as the planet orbits the Sun.
        `
    },
    {
        name: "Mars",
        radius: 90,
        orbitRadius: 2324, // 1.52 * 1200 + 500 = 2324
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Mars, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Mars),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Mars),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Mars,
        color: 0xff3300,
        textureFile: "marstexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Mars,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Mars,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Mars,
        description: `
            <strong>The Red Planet</strong><br>
            Mars orbits the Sun every 1.88 Earth years at an average distance of 1.52 AU.<br><br>
            
            <strong>Similar day length</strong><br>
            A day on Mars (called a sol) lasts 24.62 hours, very similar to Earth's day.<br><br>
            
            <strong>Thin atmosphere</strong><br>
            The atmosphere is about 100 times thinner than Earth's, primarily composed of carbon dioxide (95.3%).<br><br>
            
            <strong>Polar ice caps</strong><br>
            Mars has polar ice caps made of water and carbon dioxide ice, which grow and recede with the seasons.
        `
    },
    {
        name: "Jupiter",
        radius: 240,
        orbitRadius: 6740, // 5.20 * 1200 + 500 = 6740
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Jupiter, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Jupiter),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Jupiter),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Jupiter,
        color: 0xffaa88,
        textureFile: "jupitertexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Jupiter,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Jupiter,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Jupiter,
        description: `
            <strong>The largest planet</strong><br>
            Jupiter orbits the Sun every 11.86 Earth years at an average distance of 5.20 AU.<br><br>
            
            <strong>Rapid rotation</strong><br>
            Despite its enormous size, Jupiter rotates very quickly - a day lasts only 9.93 hours.<br><br>
            
            <strong>Strong magnetic field</strong><br>
            Jupiter has a magnetic field 14 times stronger than Earth's, creating intense radiation belts.<br><br>
            
            <strong>Great Red Spot</strong><br>
            The famous storm has been raging for at least 400 years and is larger than Earth.
        `
    },
    {
        name: "Saturn",
        radius: 210,
        orbitRadius: 11948, // 9.54 * 1200 + 500 = 11948
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Saturn, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Saturn),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Saturn),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Saturn,
        color: 0xffdd88,
        textureFile: "saturntexture.jpg",
        hasRings: true,
        ringTexture: "2k_saturn_ring_alpha.png",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Saturn,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Saturn,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Saturn,
        description: `
            <strong>The ringed planet</strong><br>
            Saturn orbits the Sun every 29.46 Earth years at an average distance of 9.54 AU.<br><br>
            
            <strong>Fast rotation</strong><br>
            Saturn rotates every 10.66 hours, making it the second fastest-rotating planet after Jupiter.<br><br>
            
            <strong>Spectacular rings</strong><br>
            Saturn's rings are composed of ice particles, rocky debris, and dust spanning up to 282,000 km.<br><br>
            
            <strong>Low density</strong><br>
            Saturn is the least dense planet; it would float if placed in a large enough ocean.
        `
    },
    {
        name: "Uranus",
        radius: 150,
        orbitRadius: 23516, // 19.18 * 1200 + 500 = 23516
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Uranus, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Uranus),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Uranus),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Uranus,
        color: 0x88ffff,
        textureFile: "uranustexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Uranus,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Uranus,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Uranus,
        description: `
            <strong>The tilted ice giant</strong><br>
            Uranus orbits the Sun every 84.01 Earth years at an average distance of 19.18 AU.<br><br>
            
            <strong>Extreme tilt</strong><br>
            Uranus rotates on its side with an axial tilt of 98 degrees, rotating every 17.24 hours retrograde.<br><br>
            
            <strong>Coldest planet</strong><br>
            Despite not being the farthest planet, Uranus is the coldest with temperatures of -195°C.<br><br>
            
            <strong>Faint rings</strong><br>
            Uranus has a system of faint rings discovered in 1977, composed of dark particles.
        `
    },
    {
        name: "Neptune",
        radius: 150,
        orbitRadius: 36572, // 30.06 * 1200 + 500 = 36572
        orbitSpeed: calculateOrbitalSpeed(REAL_ASTRONOMICAL_DATA.distances.Neptune, REAL_ASTRONOMICAL_DATA.orbitalPeriods.Neptune),
        rotationSpeed: calculateRotationSpeed(REAL_ASTRONOMICAL_DATA.rotationPeriods.Neptune),
        eccentricity: REAL_ASTRONOMICAL_DATA.eccentricity.Neptune,
        color: 0x4444ff,
        textureFile: "neptunetexture.jpg",
        realDistance: REAL_ASTRONOMICAL_DATA.distances.Neptune,
        realOrbitalPeriod: REAL_ASTRONOMICAL_DATA.orbitalPeriods.Neptune,
        realRotationPeriod: REAL_ASTRONOMICAL_DATA.rotationPeriods.Neptune,
        description: `
            <strong>The windiest planet</strong><br>
            Neptune orbits the Sun every 164.8 Earth years at an average distance of 30.06 AU.<br><br>
            
            <strong>Moderate rotation</strong><br>
            Neptune rotates every 16.11 hours, slightly slower than Uranus.<br><br>
            
            <strong>Extreme winds</strong><br>
            Neptune has the fastest winds in the solar system, reaching speeds of up to 2,100 km/h.<br><br>
            
            <strong>Great Dark Spot</strong><br>
            Similar to Jupiter's Great Red Spot, Neptune had a Great Dark Spot that has since disappeared.
        `
    }
];

/**
 * Données de la Lune avec paramètres réalistes
 */
export const MOON_DATA = {
    name: "Moon",
    radius: 30,
    orbitRadius: 300,
    orbitSpeed: 0.01, // Environ 27.3 jours pour orbiter la Terre
    rotationSpeed: 0.01, // Rotation synchrone avec l'orbite
    color: 0xaaaaaa,
    textureFile: "2k_moon.jpg",
    realOrbitalPeriod: 27.3, // jours
    realRotationPeriod: 27.3, // jours (rotation synchrone)
    description: `
        <strong>Earth's only natural satellite</strong><br>
        The Moon orbits Earth every 27.3 days at an average distance of 384,400 km.<br><br>
        
        <strong>Synchronous rotation</strong><br>
        The Moon rotates on its axis in exactly the same time it takes to orbit Earth (27.3 days), resulting in the same side always facing our planet.<br><br>
        
        <strong>Surface features</strong><br>
        The Moon's surface is characterized by impact craters, lunar maria (dark basaltic plains), and highlands.<br><br>
        
        <strong>Tidal effects</strong><br>
        The Moon's gravitational pull causes Earth's tides and is gradually slowing Earth's rotation while moving away from Earth.<br><br>
        
        <strong>Lunar phases</strong><br>
        The Moon goes through phases based on its position relative to Earth and the Sun, which affects the amount of its illuminated surface visible from Earth.
    `
};