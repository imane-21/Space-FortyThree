# 🌌 Space FortyThree

<div align="center">
  <h3>Interactive 3D Solar System Visualization</h3>
  <p>Explore the solar system with scientifically accurate planetary data and elliptical orbits</p>
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Visit%20Site-blue)](https://imane-21.github.io/Space-FortyThree/)
  [![Three.js](https://img.shields.io/badge/Three.js-r128-orange)](https://threejs.org/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

## 📖 Overview

**Space FortyThree** is an interactive 3D solar system visualization built in 48 hours during the Space Apps Challenge hackathon in Paris (October 5th, 2024). This project showcases a scientifically accurate representation of our solar system with real planetary data and physics-based orbital mechanics.

**Original Challenge**: [Create an Orrery Web App that Displays Near-Earth Objects](https://www.spaceappschallenge.org/nasa-space-apps-2024/challenges/create-an-orrery-web-app-that-displays-near-earth-objects/)

## ✨ Features

### 🌍 **Realistic Solar System**
- **Scientifically accurate data**: Real distances, orbital periods, and rotation speeds
- **Elliptical orbits**: Planets follow Kepler's laws with correct eccentricity
- **Proportional scaling**: Maintains relative distances while keeping planets clickable
- **Authentic textures**: High-quality planetary surface textures

### 🎮 **Interactive Controls**
- **WASD Movement**: Navigate freely through space
- **Arrow Keys**: Control camera rotation (look around)
- **Space/Shift**: Move up and down
- **Click Planets**: Get detailed information and auto-zoom
- **Smooth Animations**: Fluid transitions and movements

### 📊 **Educational Content**
- **Detailed Planet Information**: Scientific facts, composition, and characteristics
- **Real Astronomical Data**: Distances in AU, orbital periods, rotation periods
- **Orbital Mechanics**: Visualize elliptical vs circular orbits
- **Interactive Learning**: Click and explore at your own pace

### 🎬 **Cinematic Experience**
- **Intro Video**: Custom Blender-created cinematic introduction
- **Smooth Zoom**: Intelligent camera positioning for optimal planet viewing
- **Professional UI**: Clean, space-themed interface with smooth transitions

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- No installation required - runs directly in browser!


## 🎯 How to Use

1. **🎬 Watch the intro** or click "Skip" to jump straight to exploration
2. **🌌 Navigate freely** using WASD keys to move through space
3. **👁️ Look around** using arrow keys to control camera rotation
4. **🌍 Click any planet** to zoom in and view detailed information
5. **📚 Read scientific data** displayed in the information panel
6. **🚀 Move to exit zoom** - use any movement key to return to free camera

## 🛠️ Technologies Used

- **[Three.js](https://threejs.org/)** - 3D graphics and WebGL rendering
- **[Blender](https://www.blender.org/)** - Intro cinematic creation
- **JavaScript ES6+** - Modern JavaScript with modules
- **HTML5 & CSS3** - Responsive web interface
- **WebGL** - Hardware-accelerated 3D graphics

## 🔬 Scientific Accuracy

### Planetary Data
- **Orbital Distances**: Real distances in Astronomical Units (AU)
- **Orbital Periods**: Accurate revolution times around the Sun
- **Rotation Periods**: Real planetary day lengths
- **Eccentricity Values**: Authentic elliptical orbit shapes

### Kepler's Laws Implementation
- **Elliptical Orbits**: Mercury (0.206), Mars (0.093), others nearly circular
- **Orbital Mechanics**: Speed varies based on distance from Sun
- **Proportional Scaling**: Maintains relative relationships

## 📁 Project Structure

```
Space-FortyThree/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Styling and animations
├── js/
│   ├── main.js            # Application entry point
│   ├── config.js          # Scientific data and configuration
│   ├── planets.js         # Planet system and orbital mechanics
│   ├── camera.js          # Camera controls and movement
│   ├── ui.js              # User interface management
│   ├── interaction.js     # Click interactions and selection
│   └── utils.js           # Utility functions
└── assets/
    ├── textures/          # Planet and moon textures
    └── videos/            # Intro cinematic video
```

## 👥 Contributors

- [**Imane Barahimi**](https://github.com/imane-21) - Project Lead & 3D Development
- [**Yassin Fradj**](https://github.com/yassn0) - Full-Stack Development & Architecture
- [**Said Lebik**](https://github.com/slkrt111) - UI/UX Design & Frontend
- [**Bilal Hamani**](https://github.com/Bilscript) - Backend & Data Integration
- [**Sami Hessoun**](https://github.com/akshayyy12a) - Testing & Documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>🌌 <strong>Explore the universe from your browser!</strong> 🌌</p>
  <p>Made with ❤️ during NASA Space Apps Challenge 2024</p>
</div>