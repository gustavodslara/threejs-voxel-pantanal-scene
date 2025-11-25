# Pantanal Voxel River – 3D Procedural Scene

> Lightweight, procedural voxel river environment inspired by the Brazilian Pantanal. Features underwater depth fog, adaptive terrain, probabilistic forest growth, lily pads, and optional skybox – all in pure **Three.js**.

![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESModules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebGL](https://img.shields.io/badge/WebGL-Enabled-990000?style=for-the-badge&logo=webgl&logoColor=white)
![Performance](https://img.shields.io/badge/Optimized-Instant%20Load-2E8B57?style=for-the-badge)
![i18n](https://img.shields.io/badge/i18n-en--US%20|%20pt--BR-007ACC?style=for-the-badge)

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

## ✨ Key Features

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

## 🏗 Architecture Snapshot

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

## 🌍 Terrain Generation

Core loop scans X/Z grid (−50..50). Each column decides river vs land:

1. Bank displacement: `sin(z * 0.2) * 2` shifts edges; avoids unnatural straight banks.
2. Depth tiers: distance-from-center + distance-from-bank compute stepped top depth.
3. River fill: full vertical fill from FOUNDATION_DEPTH (−25) to top using dirt below & mud near top.
4. Land elevation: piecewise function (flat near water → gently rising → capped plateau) + random micro variation.
5. Land optimization: only shell (surface−2 .. surface) stored to cut voxel count dramatically.
6. Height map recorded for tree placement.

Benefits: Fast O(N²) deterministic; no noise libraries; easy param tuning; memory conscious.

---

## 🌲 Vegetation System

Grid stride 2 for placement candidates. Probabilities scale with river distance; trig “noise” multiplies density to carve sparse zones.

Tree types:
- Mega: high canopy radius, optional roots.
- Large: mid canopy, occasional roots near banks.
- Normal: baseline forest mass.
- Small Twisted: branch walker creating organic spread + mini foliage cap.

Spacing: occupied set prevents overlap; each type reserves radius (4–8). Foliage layering uses shrinking radial discs; leaf materials selected via random thresholds for coloration variation. Moss/vines hang in random angular distribution beneath canopy layers.

---

## 🌫 Underwater Fog

28 horizontal planes (52×125) descending to −26. Opacity curve:

```
opacity = clamp(0.06 + depthFactor * 0.22, 0, 0.20)
depthFactor = t^2 * (0.85 + 0.15 * t)  // t = (layerIndex+1)/LAYERS
```

Result: accelerated darkening with depth; stable performance (no per-fragment volumetric math). Render order ensures fog underneath water surface.

---

## 📦 Instancing Strategy

Per material: array of `THREE.InstancedMesh` batches (capacity 50k). Manual `count` tracking avoids overhead of removing/adding geometry mid-frame. Only one matrix update per batch after population.

Performance choices:
- Disable per-instance shadow casting (receive only)
- Cap device pixel ratio at 1
- Keep geometry static post-build (no dynamic writes)
- Thin land vs full volume interior

---

## 🌐 Skybox Integration

Helpers:
```js
setSkyboxFromCubemap([px, nx, py, ny, pz, nz]);
setSkyboxFromEquirect('textures/sky/equirect.jpg');
```
Assigns `scene.background` (sRGB). Optional: `scene.environment = scene.background` if upgrading to PBR materials.

---

## 🗣 i18n

`i18n.js` auto-detects `navigator.language` → sets `<html lang>` and fills elements with `data-i18n`. To force language:
```js
import { applyTranslations } from './i18n.js';
applyTranslations('pt-BR');
```
Extend by adding language object + keys in `translations`.

---

## ⚙ Configuration Hotspots

| Area | Function | Variables |
|------|----------|-----------|
| Fog | `createUnderwaterFogLayers` | LAYERS, BOTTOM_Y, WIDTH/LENGTH, opacity formula |
| Terrain | `createTerrain` | Depth tier thresholds, bank wave magnitude |
| Forest | `populateForest` | Probability curves, spacing, type ratios |
| Water | `createWaterPlane` | Color, opacity, renderOrder |
| Instances | batch creation | MAX_INSTANCES, shadow toggles |

---

## 🚀 Running Locally

Static module use requires an HTTP server:
```bash
python -m http.server 8080
```
Visit: `http://localhost:8080`

## 🔎 VR / WebXR
This project includes WebXR support. To use it:

- Enter VR using the built-in VR button (appears if your browser/device supports WebXR).
- Use the left controller's thumbstick to move and fly: pushing forward moves you forward; pushing up while forward enables flight (a small vertical component). The movement is smooth and sticky for comfortable control.

Notes:
- Some headsets/controllers map axes differently; the implementation attempts to automatically find the left stick axes.
- Controller models will display in the scene to indicate active controllers.

Add skybox assets under `textures/skybox/` or `textures/sky/` before uncommenting examples.

---

## 🔧 Extensibility Ideas

- Shader-based single volume fog
- Deterministic seeded RNG
- GUI (lil-gui) for live tuning
- Convert to `MeshStandardMaterial` + HDR environment
- Frustum + distance culling for large worlds
- Save/load biome seeds

---

## 🧪 Quality & Performance Notes

- Bounded draw calls via material batching
- Minimal overdraw (flat water + non-depth-writing fog)
- Avoids complex fragment loops (no raymarching)
- Predictable memory footprint (grid bounds fixed)

---

## 🤝 Contributing

Guidelines:
- Keep materials lean (avoid excessive new variants)
- Preserve batching pattern (don’t mix single Mesh spam)
- Document new tunables in README table
- For major changes consider adding seed-based deterministic mode

Suggested commit prefixes:
```
feat: add X
fix: correct Y
perf: optimize Z
docs: update README
refactor: restructure generation logic
chore: maintenance
```

---

## 📄 License & Assets

Project code: MIT (add explicit LICENSE if distributing).
Add attribution for any external skybox / HDR textures you include.

---

## 🙏 Acknowledgments

- Three.js community for core rendering
- Open nature references (Pantanal imagery) inspiring palette
- Procedural generation research for lightweight terrain heuristics

---

**Crafted for clarity, tweakability, and performance – explore, extend, and adapt.**
