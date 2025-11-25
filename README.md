# Voxel Canvas - Three.js

> Lightweight, procedural voxel river environment inspired by the Rio Cuiabá. Features underwater depth fog, adaptive terrain, probabilistic forest growth, lily pads, and optional skybox – all in pure **Three.js**.

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-v0.154-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESModules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![i18n](https://img.shields.io/badge/i18n-6%20Languages-007ACC?style=for-the-badge)

---

## 🎯 Overview

This project renders a voxel-style river segment with:

- Procedural terrain (banks + depth profile + land shell optimization)
- Layered underwater fog (volumetric feel without shaders)
- Translucent muddy water surface
- Instanced voxel batching per material (scalable to tens of thousands of blocks)
- Multi-type tree system (mega / large / normal / small twisted)
- Hanging moss & vine detailing
- Lily pad clusters for foreground interest
- Optional cubemap or equirectangular skybox
- Automatic language switching (pt-BR / en-US)

All authored in a single modular Three.js file – no build step required.

---

## ✨ Features

- ⚙️ Procedural terrain generation (deterministic trigonometric shaping)
- 🌊 Underwater vertical fog via stacked plane layering
- 🚀 High-performance instancing (batched by material, zero per-frame matrix churn)
- 🌱 Probabilistic vegetation placement with spacing + rarity tiers
- 🪵 Twisted branch micro-structure for small tree variation
- 🪷 Lily pad voxel micro-geometry (thin volume elements)
- 🌐 Skybox helper (cubemap or equirectangular)
- 🔁 Clean resize & render loop with damped orbit controls
- 🗣️ i18n via data attributes + auto detection

---

## 🚀 Getting Started

| Layer | Technique | Purpose |
|-------|-----------|---------|
| Terrain | Sinusoidal bank offsets + depth tiers | Natural channel variation |
| Riverbed | Solid vertical fill | Prevent interior visibility gaps |
| Land | Thin surface shell | Reduce voxel count & memory |
| Fog | 28 planes, cubic opacity curve | Cheap volumetric depth masking |
| Vegetation | Probability + distance rules | Biome density control |
| Trees | Type-specific geometry strategies | Diversity + silhouette richness |
| Water | Single plane (translucent) | Surface reference & depth cover |
| Skybox | CubeTexture/Equirect loader | Immersive environment backdrop |

---

## 📖 Usage Guide

### 🖱️ Basic Controls

**Mouse Controls**:
- **Left Click**: Place a voxel
- **Right Click**: Remove a voxel
- **Mouse Drag**: Rotate camera (OrbitControls)
- **Mouse Wheel**: Zoom in/out
- **Middle Mouse Button + Drag**: Pan camera

**Keyboard Shortcuts**:
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo

### 🔧 Toolbar Features

- **🎨 Color Palette**: Select from preset colors or use the color picker.
- **📐 Grid Mode**: Toggle between single cube and grid wall modes.
- **↩️ Undo/Redo**: Manage your edit history.
- **🗑️ Clear Canvas**: Remove all voxels.
- **💾 Save/Load**: Export and import your work.
- **📤 Export**: Export as 3D models or images.
- **⚙️ Settings**: Configure grid resolution and voxel dimensions.
- **🤖 AI Generation**: Generate voxel art from text descriptions.
- **🌐 Language**: Switch between supported languages.

### 💾 Working with Sessions

- Each session is automatically assigned a unique ID.
- Your work is saved automatically to `localStorage`.
- Sessions persist across page refreshes.
- The session ID is stored in the URL for easy sharing.
- Clear session data using the Clear Canvas button.

### 🤖 AI Voxel Generation

1.  Click the **AI** button in the toolbar.
2.  Enter a descriptive prompt (e.g., "a red sports car", "medieval castle").
3.  Adjust dimensions (width, height, depth).
4.  Click **Generate**.
5.  Wait for the AI to process your request.
6.  The generated voxel model will appear on your canvas.

**Tips for better results**:
- Be specific in your descriptions.
- Use simple, clear language.
- Start with smaller dimensions (8x8x8) for faster generation.
- Experiment with different prompts for the same object.

---

## 🏗️ Architecture

### Architecture Snapshot

| Layer | Technology / Technique | Purpose |
|---|---|---|
| Rendering | Three.js (v0.154) + ES Modules | Core 3D engine & scene management |
| UI / Styling | Tailwind CSS (CDN) | Rapid, responsive interface |
| State | `localStorage` + URL Params | Session persistence & auto-save |
| i18n | Custom `i18n.js` + JSON files | Dynamic multi-language support |
| AI Generation | Google Gemini API (Fetch) | Text-to-voxel model generation |
| Export | Three.js Exporters | GLTF, OBJ, STL, PNG, JPG output |
| Build System | None (Client-side only) | Maximum portability, no build step |

### Project Structure
threejs-voxel-canvas/ ├── index.html # Main HTML file ├── LICENSE # MIT License ├── README.md # This file └── public/ ├── assets/ │ └── images/ # Logo and branding assets │ ├── threejs-pixel-canvas-logo.png │ ├── pixel-canvas-title.png │ └── pixel-canvas-title-square.png ├── css/ │ └── main.css # Custom styles ├── js/ │ ├── main.js # Core application logic │ └── i18n.js # Internationalization system └── locales/ # Translation files ├── en-US.json # English translations ├── pt-BR.json # Portuguese translations ├── es-ES.json # Spanish translations ├── fr-FR.json # French translations ├── de-DE.json # German translations └── ja-JP.json # Japanese translations

### ⚙️ Configuration Hotspots

| Area | File(s) | Purpose |
|---|---|---|
| Core Logic | `public/js/main.js` | Main application, Three.js scene, voxel logic, history, AI, exports |
| i18n System | `public/js/i18n.js` | Language detection, JSON loading, & DOM translation |
| Translations | `public/locales/*.json` | Language-specific string storage (e.g., `en-US.json`) |
| Custom Styles | `public/css/main.css` | Tailwind complements, loader styles, & UI tweaks |
| Main Page | `index.html` | DOM structure, toolbar, modals, & color palette |

---

## 🔮 Future Plans

### 🚀 Migration to Angular

We are planning a major architectural overhaul to migrate this project to Angular. This migration will provide:

#### Benefits
- **Better Maintainability**: Component-based architecture with clear separation of concerns.
- **Type Safety**: Full TypeScript support for fewer runtime errors.
- **Testing**: Built-in testing framework (Jasmine/Karma).
- **State Management**: Reactive state management with RxJS.
- **Scalability**: Better structure for adding complex features.
- **Developer Experience**: Superior tooling, debugging, and IDE support.

#### Planned Architecture
Você está absolutamente certo. Peço desculpas pela confusão. Eu interpretei mal seu pedido.

Minha intenção na última resposta foi fornecer o texto puro do Markdown, para que ele fosse renderizado diretamente. Agora entendo que você queria o código-fonte completo do arquivo, tudo dentro de um único bloco de código para que você pudesse copiá-lo e colá-lo facilmente.

Aqui está, da forma correta: um único bloco de código Markdown contendo o arquivo editado.

Markdown

# Voxel Canvas - Three.js

> A powerful, browser-based 3D voxel editor built with Three.js. Create, edit, and export 3D voxel art with an intuitive interface, AI-powered generation, and broad export compatibility.

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-v0.154-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESModules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![i18n](https://img.shields.io/badge/i18n-6%20Languages-007ACC?style=for-the-badge)
![AI Enabled](https://img.shields.io/badge/AI-Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 🎯 Overview

Voxel Canvas is a feature-rich, client-side 3D voxel editor that runs **entirely in your browser**. It provides a seamless, high-performance experience for creating voxel art, from simple pixel-art style creations to complex 3D models. With session persistence, robust undo/redo functionality, and AI-powered generation capabilities, it's designed for both casual users and serious voxel artists.

---

## ✨ Features

### ⚙️ Core Functionality
- **3D Voxel Editing**: Paint in 3D space with intuitive mouse controls.
- **Two Editing Modes**:
  - **Single Cube Mode**: Place individual voxels freely in 3D space.
  - **Grid Mode**: Work with a defined canvas grid (wall) for structured pixel art.
- **Color Palette**: Extensive color selection with custom color picker.
- **Ghost Cursor**: Visual preview of voxel placement before committing.
- **Undo/Redo**: Full undo/redo support with keyboard shortcuts (Ctrl+Z / Ctrl+Y).

### 🚀 Advanced Features
- **Session Management**: Automatic session persistence with URL-based session tracking.
- **Auto-save**: Continuous auto-save of your work to `localStorage`.
- **AI-Powered Generation**: Generate 3D voxel models from text prompts using Google's Gemini API.
- **Dynamic Grid Resolution**: Adjustable canvas sizes from 4x4 to 128x128.
- **Custom Voxel Dimensions**: Define width, height, and depth of voxels independently.

### 📤 Export Options
- **3D Model Formats**:
  - GLTF/GLB (recommended for 3D applications)
  - OBJ (widely compatible)
  - STL (for 3D printing)
- **Image Export**:
  - PNG (with transparency)
  - JPG (adjustable quality)
  - Multiple resolution scales (1x, 2x, 4x, 8x)

### 🌐 Internationalization (i18n)
- **Supported Languages**:
  - English (en-US)
  - Portuguese (pt-BR)
  - Spanish (es-ES)
  - French (fr-FR)
  - German (de-DE)
  - Japanese (ja-JP)
- **Automatic Language Detection**: Detects browser language preference.
- **Easy Language Switching**: Runtime language changes without reload.

### 🎨 User Experience
- **Responsive Design**: Works on various screen sizes.
- **Dark Theme**: Easy-on-the-eyes dark interface.
- **Cookie Consent**: GDPR-compliant cookie consent system.
- **Loading Indicators**: Visual feedback during operations.
- **Notifications**: Toast-style notifications for user actions.

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)
- (Optional) Google Gemini API key for AI generation features

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/gustavodslara/threejs-voxel-canvas.git](https://github.com/gustavodslara/threejs-voxel-canvas.git)
    cd threejs-voxel-canvas
    ```

2.  **Serve the application**:

    This project uses ES Modules and must be served from an HTTP server.

    **Using Python**:
    ```bash
    # Python 3
    python -m http.server 8000
    
    # Python 2
    python -m SimpleHTTPServer 8000
    ```

    **Using Node.js**:
    ```bash
    npx serve .
    ```

    **Using VS Code**:
    - Install the "Live Server" extension.
    - Right-click on `index.html` and select "Open with Live Server".

3.  **Access the application**:
    Open your browser and navigate to `http://localhost:8000`

### 🤖 AI Generation Setup (Optional)

To use the AI-powered voxel generation feature:

1.  Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2.  In the application, click the **AI** button in the toolbar.
3.  Click **Configure API Key**.
4.  Enter your API key and save.
5.  The key is stored securely in your browser's `localStorage`.

---

## 📖 Usage Guide

| Area | Function | Variables |
|------|----------|-----------|
| Fog | `createUnderwaterFogLayers` | LAYERS, BOTTOM_Y, WIDTH/LENGTH, opacity formula |
| Terrain | `createTerrain` | Depth tier thresholds, bank wave magnitude |
| Forest | `populateForest` | Probability curves, spacing, type ratios |
| Water | `createWaterPlane` | Color, opacity, renderOrder |
| Instances | batch creation | MAX_INSTANCES, shadow toggles |

---

## 🏗️ Architecture

### Architecture Snapshot

## 🔎 VR / WebXR
This project includes WebXR support. To use it:

- Enter VR using the built-in VR button (appears if your browser/device supports WebXR).
- Use the left controller's thumbstick to move and fly: pushing forward moves you forward; pushing up while forward enables flight (a small vertical component). The movement is smooth and sticky for comfortable control.

Notes:
- Some headsets/controllers map axes differently; the implementation attempts to automatically find the left stick axes.
- Controller models will display in the scene to indicate active controllers.

Add skybox assets under `textures/skybox/` or `textures/sky/` before uncommenting examples.

---

## 🔮 Future Plans

### 🚀 Migration to Angular

We are planning a major architectural overhaul to migrate this project to Angular. This migration will provide:

#### Benefits
- **Better Maintainability**: Component-based architecture with clear separation of concerns.
- **Type Safety**: Full TypeScript support for fewer runtime errors.
- **Testing**: Built-in testing framework (Jasmine/Karma).
- **State Management**: Reactive state management with RxJS.
- **Scalability**: Better structure for adding complex features.
- **Developer Experience**: Superior tooling, debugging, and IDE support.

#### Planned Architecture
angular-voxel-canvas/ ├── src/ │ ├── app/ │ │ ├── core/ # Singleton services │ │ │ ├── session/ │ │ │ ├── storage/ │ │ │ └── i18n/ │ │ ├── features/ # Feature modules │ │ │ ├── editor/ │ │ │ ├── export/ │ │ │ ├── ai-generation/ │ │ │ └── settings/ │ │ ├── shared/ # Shared components │ │ │ ├── components/ │ │ │ ├── directives/ │ │ │ └── pipes/ │ │ └── models/ # TypeScript interfaces │ ├── assets/ │ └── environments/
#### Migration Timeline
- **Phase 1**: Setup Angular project structure (Q1 2026)
- **Phase 2**: Migrate core voxel editor (Q2 2026)
- **Phase 3**: Migrate i18n and UI components (Q2 2026)
- **Phase 4**: Migrate export and AI features (Q3 2026)
- **Phase 5**: Testing, optimization, and deployment (Q4 2026)

### 💡 Additional Planned Features
- **Collaborative Editing**: Real-time multiplayer voxel editing
- **Cloud Storage**: Save projects to cloud with user accounts
- **Animation**: Keyframe-based voxel animations
- **Layers**: Multi-layer support for complex projects
- **Templates**: Pre-built templates and starter projects
- **Plugin System**: Extensible architecture for community plugins
- **Mobile Support**: Touch-optimized controls for tablets
- **VR Support**: Virtual reality voxel editing

---

## 🧪 Quality & Performance Notes

- **Client-Side First**: Runs 100% in the browser. No server-side rendering or backend state required (excluding the optional AI API).
- **Minimal Load**: Uses ES Modules with Import Maps, loading Three.js and other dependencies efficiently from CDNs. No build step needed.
- **Stateful Persistence**: Leverages `localStorage` for instant session auto-save and recovery, minimizing data loss.
- **Optimized Rendering**: Uses standard Three.js geometry. Performance is dependent on the number of voxels in the scene.
- **Responsive UI**: Built with Tailwind CSS for a fully responsive layout that works on various screen sizes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### 🧑‍💻 How to Contribute

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

### 📜 Contribution Guidelines

- Follow the existing code style.
- Test your changes thoroughly.
- Update documentation as needed.
- Keep commits focused and atomic.
- Write clear commit messages.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
Copyright (c) 2025 Gustavo Lara (gustavodslara) Cuiabá, Mato Grosso, Brazil

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
---

## 🙏 Acknowledgments

- **Three.js**: For the amazing 3D rendering library
- **Google Gemini**: For AI-powered generation capabilities
- **Tailwind CSS**: For rapid UI development
- **Contributors**: All contributors who help improve this project

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/gustavodslara/threejs-voxel-canvas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gustavodslara/threejs-voxel-canvas/discussions)

## 🔗 Links

- **Repository**: [https://github.com/gustavodslara/threejs-voxel-canvas](https://github.com/gustavodslara/threejs-voxel-canvas)
- **Three.js**: [https://threejs.org/](https://threejs.org/)
- **Google Gemini**: [https://ai.google.dev/](https://ai.google.dev/)

---

**Crafted for creativity, performance, and accessibility – build, share, and export.**
