import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

const loadingSpinner = document.getElementById('loading-spinner');
let skyboxLoaded = false;
let sceneReady = false;

function checkAndHideSpinner() {
    if (skyboxLoaded && sceneReady) {
        loadingSpinner.style.display = 'none';
    }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc4d4b8);
const container = document.getElementById('canvas-container');
const camera = new THREE.PerspectiveCamera(45, (container && container.clientWidth) ? container.clientWidth / container.clientHeight : window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize((container && container.clientWidth) ? container.clientWidth : window.innerWidth, (container && container.clientHeight) ? container.clientHeight : window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1)); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

camera.position.set(0, 12, -40);
camera.lookAt(0, 12, -20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 12, -20);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

scene.add(new THREE.AmbientLight(0xd4c4a8, 0.7));
const dirLight = new THREE.DirectionalLight(0xfff4d4, 0.9);
dirLight.position.set(15, 25, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

const player = new THREE.Group();
player.position.copy(camera.position);
player.add(camera);
scene.add(player);

const VOXEL_SIZE = 1;
const voxelGeometry = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
const materials = {
    grass: new THREE.MeshLambertMaterial({ color: 0x6a9c4d }),
    darkGrass: new THREE.MeshLambertMaterial({ color: 0x5a8a3d }),
    moss: new THREE.MeshLambertMaterial({ color: 0x7aaa5d }),
    dirt: new THREE.MeshLambertMaterial({ color: 0x7d5a3a }),
    mud: new THREE.MeshLambertMaterial({ color: 0x6a4d2a }),
    woodDark: new THREE.MeshLambertMaterial({ color: 0x5a4a3a }),
    leaves: new THREE.MeshLambertMaterial({ color: 0x4a6a3a }),
    leavesDense: new THREE.MeshLambertMaterial({ color: 0x3a5a2a }),
    leavesLight: new THREE.MeshLambertMaterial({ color: 0x6a8a4a }),
    leavesYellow: new THREE.MeshLambertMaterial({ color: 0x9aaa5a }),
    vine: new THREE.MeshLambertMaterial({ color: 0x5a6a4a }),
    hangingMoss: new THREE.MeshLambertMaterial({ color: 0x7a8a6a }),
    lilyPad: new THREE.MeshLambertMaterial({ color: 0x4a7a4a })
};

function setSkyboxFromCubemap(files) {
    const loader = new THREE.CubeTextureLoader();
    const cube = loader.load(files, () => {
        skyboxLoaded = true;
        checkAndHideSpinner();
    });
    cube.colorSpace = THREE.SRGBColorSpace;
    scene.background = cube;
    return cube;
}

function setSkyboxFromEquirect(url) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url, () => {
        skyboxLoaded = true;
        checkAndHideSpinner();
    });
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.background = tex;
    return tex;
}

const instancedMeshes = {};

const MAX_INSTANCES = 50000;

function createInstancedMeshBatch(matName) {
    const mesh = new THREE.InstancedMesh(voxelGeometry, materials[matName], MAX_INSTANCES);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.count = 0; 
    instancedMeshes[matName].meshes.push(mesh);
    return mesh;
}

function initializeInstancedMeshes() {
    Object.keys(materials).forEach(name => {
        instancedMeshes[name] = { meshes: [], total: 0 };
        createInstancedMeshBatch(name);
    });
}

const tempMatrix = new THREE.Matrix4();

function addVoxelInstance(x, y, z, matName) {
    const bucket = instancedMeshes[matName];
    if (!bucket) return;
    let mesh = bucket.meshes[bucket.meshes.length - 1];
    if (!mesh || mesh.count >= MAX_INSTANCES) mesh = createInstancedMeshBatch(matName);
    tempMatrix.setPosition(x, y, z);
    mesh.setMatrixAt(mesh.count, tempMatrix);
    mesh.count++;
    bucket.total++;
}

function createVoxel(x, y, z, material) { return { x, y, z, material }; }

function addVoxelsToScene(voxels) {
    const map = new Map();
    for (const v of voxels) {
        const key = `${v.x},${v.y},${v.z}`;
        map.set(key, v);
    }
    for (const v of map.values()) {
        const matName = Object.keys(materials).find(k => materials[k] === v.material);
        if (matName) addVoxelInstance(v.x, v.y, v.z, matName);
    }
}

function createWaterPlane() {
    const geom = new THREE.PlaneGeometry(100, 100);
    const mat = new THREE.MeshLambertMaterial({ color: 0xb8945c, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
    const water = new THREE.Mesh(geom, mat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    water.renderOrder = 2;
    return water;
}

function createUnderwaterFogLayers() {
    const group = new THREE.Group();
    const RIVER_WIDTH = 52;
    const RIVER_LENGTH = 125;
    const SURFACE_Y = 0;
    const BOTTOM_Y = -26;
    const LAYERS = 28;
    const COLOR = 0x5b4a33;
    for (let i = 0; i < LAYERS; i++) {
        const t = (i + 1) / LAYERS;
        const y = THREE.MathUtils.lerp(SURFACE_Y, BOTTOM_Y, t);
        const depthFactor = t * t * (0.85 + t * 0.15);
        const opacity = Math.min(0.20, 0.06 + depthFactor * 0.22);
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(RIVER_WIDTH, RIVER_LENGTH),
            new THREE.MeshBasicMaterial({ color: COLOR, transparent: true, opacity, depthWrite: false })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = y;
        plane.renderOrder = 1; 
        group.add(plane);
    }
    return group;
}

function createTerrain() {
    const voxels = [];
    const heightMap = {};
    const FOUNDATION_DEPTH = -25;
    const WATER_LEVEL = 0;
    const RIVER_HALF_WIDTH = 20;
    for (let z = -50; z <= 50; z++) {
        for (let x = -50; x <= 50; x++) {
            const bankWaveLeft = Math.floor(Math.sin(z * 0.2) * 2);
            const bankWaveRight = Math.floor(Math.sin(z * 0.2) * 2);
            const leftEdge = -RIVER_HALF_WIDTH + bankWaveLeft;
            const rightEdge = RIVER_HALF_WIDTH + bankWaveRight;
            const inRiver = x > leftEdge && x < rightEdge;
            if (inRiver) {
                const distLeft = Math.abs(x - leftEdge);
                const distRight = Math.abs(x - rightEdge);
                const distCenter = Math.abs(x);
                const edgeDist = Math.min(distLeft, distRight);
                const depthVariation = Math.floor(Math.sin(z * 0.15) * 2);
                let top;
                if (edgeDist <= 2) top = -2 + depthVariation;
                else if (edgeDist <= 4) top = -5 + depthVariation;
                else if (distCenter < 5) top = -18 + depthVariation;
                else if (distCenter < 10) top = -14 + depthVariation;
                else if (distCenter < 15) top = -10 + depthVariation;
                else top = -7 + depthVariation;
                for (let y = FOUNDATION_DEPTH; y <= top; y++) {
                    const mat = y >= top - 2 ? materials.mud : materials.dirt;
                    voxels.push(createVoxel(x, y, z, mat));
                }
            } else {
                const distFromRiver = x <= leftEdge ? leftEdge - x : x - rightEdge;
                let surface;
                if (distFromRiver === 0) surface = -2;
                else if (distFromRiver === 1) surface = -1;
                else if (distFromRiver === 2) surface = 0;
                else if (distFromRiver < 5) surface = 1;
                else {
                    const base = Math.floor((distFromRiver - 5) / 2.5) + 2;
                    surface = Math.min(10, base + Math.floor(Math.random() * 2));
                }
                if (surface > 0) heightMap[`${x},${z}`] = surface;
                const startY = Math.max(FOUNDATION_DEPTH, surface - 2);
                for (let y = startY; y <= surface; y++) {
                    let mat;
                    if (y === surface && surface > WATER_LEVEL) mat = Math.random() > 0.5 ? materials.grass : materials.darkGrass;
                    else if (y === surface && surface <= WATER_LEVEL) mat = materials.mud;
                    else if (y < 0 && y > surface - 3) mat = materials.mud;
                    else mat = materials.dirt;
                    voxels.push(createVoxel(x, y, z, mat));
                }
                if (Math.random() > 0.7 && surface > WATER_LEVEL) voxels.push(createVoxel(x, surface, z, materials.moss));
            }
        }
    }
    return { voxels, heightMap };
}

function createTreeRoots(x, z) {
    const voxels = [];
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const len = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < len; j++) {
            const rx = x + Math.floor(Math.cos(angle) * j);
            const rz = z + Math.floor(Math.sin(angle) * j);
            const ry = 1 - j * 0.5;
            if (ry >= 0) voxels.push(createVoxel(rx, ry, rz, materials.woodDark));
        }
    }
    return voxels;
}

function createTreeTrunk(x, z, groundY, height, thickness, roots) {
    const voxels = [];
    if (roots) createTreeRoots(x, z).forEach(r => voxels.push(r));
    for (let y = 0; y < height; y++) {
        for (let dx = 0; dx < thickness; dx++) {
            for (let dz = 0; dz < thickness; dz++) {
                voxels.push(createVoxel(x + dx, groundY + y, z + dz, materials.woodDark));
            }
        }
    }
    return voxels;
}

function createTreeFoliage(cx, topY, cz, radius, type) {
    const voxels = [];
    const layers = type === 'mega' ? 7 : type === 'large' ? 5 : type === 'small' ? 3 : 4;
    for (let layer = 0; layer < layers; layer++) {
        const r = radius - layer * 0.5;
        const y = topY + layer;
        for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
            for (let dz = -Math.ceil(r); dz <= Math.ceil(r); dz++) {
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist <= r && Math.random() > 0.15) {
                    const rand = Math.random();
                    let mat = materials.leavesDense;
                    if (rand > 0.7) mat = materials.leavesLight; else if (rand > 0.5) mat = materials.leavesYellow; else if (rand > 0.3) mat = materials.leaves;
                    voxels.push(createVoxel(cx + dx, y, cz + dz, mat));
                }
            }
        }
    }
    const mossCount = type === 'mega' ? 16 : type === 'large' ? 12 : type === 'small' ? 4 : 8;
    for (let i = 0; i < mossCount; i++) {
        const ang = (Math.PI * 2 * i) / mossCount + Math.random() * 0.5;
        const dist = Math.random() * (radius - 1);
        const mx = cx + Math.floor(Math.cos(ang) * dist);
        const mz = cz + Math.floor(Math.sin(ang) * dist);
        const len = type === 'mega' ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 4) + 2;
        for (let j = 0; j < len; j++) {
            const mat = j % 2 === 0 ? materials.hangingMoss : materials.vine;
            voxels.push(createVoxel(mx, topY - j - 1, mz, mat));
        }
    }
    return voxels;
}

function createTwistedBranches(x, z, groundY, height, branchCount) {
    const voxels = [];
    const trunkStraight = Math.floor(height * 0.4);
    for (let y = 0; y < trunkStraight; y++) voxels.push(createVoxel(x, groundY + y, z, materials.woodDark));
    const remaining = height - trunkStraight;
    for (let b = 0; b < branchCount; b++) {
        const ang = (Math.PI * 2 * b) / branchCount + Math.random() * 0.5;
        let cx = x, cz = z;
        for (let y = 0; y < remaining; y++) {
            const actualY = trunkStraight + y;
            voxels.push(createVoxel(Math.round(cx), groundY + actualY, Math.round(cz), materials.woodDark));
            const spread = y / remaining;
            cx += Math.cos(ang) * 0.4 * (1 + spread);
            cz += Math.sin(ang) * 0.4 * (1 + spread);
            if (y > remaining * 0.3) {
                for (let lx = -1; lx <= 1; lx++) {
                    for (let lz = -1; lz <= 1; lz++) {
                        if (Math.random() > 0.4) {
                            const leafMat = Math.random() > 0.5 ? materials.leaves : materials.leavesDense;
                            voxels.push(createVoxel(Math.round(cx) + lx, groundY + actualY, Math.round(cz) + lz, leafMat));
                        }
                    }
                }
            }
        }
    }
    return voxels;
}

function createTree(x, z, groundY, trunkHeight, foliageRadius, type, roots, twisted) {
    const voxels = [];
    if (twisted) {
        voxels.push(...createTwistedBranches(x, z, groundY, trunkHeight, Math.floor(Math.random() * 2) + 2));
        const topY = groundY + trunkHeight;
        for (let ly = 0; ly < 2; ly++) {
            const r = foliageRadius - ly;
            const y = topY + ly;
            for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
                for (let dz = -Math.ceil(r); dz <= Math.ceil(r); dz++) {
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    if (dist <= r && Math.random() > 0.2) {
                        const leafMat = Math.random() > 0.5 ? materials.leaves : materials.leavesDense;
                        voxels.push(createVoxel(x + dx, y, z + dz, leafMat));
                    }
                }
            }
        }
    } else {
        const thickness = type === 'large' ? 2 : type === 'mega' ? 3 : 1;
        voxels.push(...createTreeTrunk(x, z, groundY, trunkHeight, thickness, roots));
        voxels.push(...createTreeFoliage(x + (thickness > 1 ? 0.5 : 0), groundY + trunkHeight, z + (thickness > 1 ? 0.5 : 0), foliageRadius, type));
    }
    return voxels;
}

function populateForest(heightMap) {
    const voxels = [];
    const occupied = new Set();
    function tooClose(x, z, r) {
        for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (occupied.has(`${x + dx},${z + dz}`)) return true;
        return false;
    }
    function mark(x, z, r) { for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) occupied.add(`${x + dx},${z + dz}`); }
    for (let x = -50; x <= 50; x += 2) {
        for (let z = -50; z <= 50; z += 2) {
            const h = heightMap[`${x},${z}`];
            if (h === undefined || h <= 0) continue;
            const distRiver = Math.abs(x);
            let prob = distRiver < 23 ? 0.18 : distRiver < 30 ? 0.28 : distRiver < 40 ? 0.36 : 0.30;
            const noiseX = Math.sin(x * 0.3) * Math.cos(z * 0.2);
            const noiseZ = Math.cos(x * 0.2) * Math.sin(z * 0.3);
            if (noiseX * noiseZ > 0.7) prob *= 0.3;
            if (Math.random() < prob) {
                const r = Math.random();
                let type, trunkHeight, foliageRadius, roots, spacing, twisted;
                if (r < 0.12) { type = 'mega'; trunkHeight = Math.floor(Math.random() * 6) + 18; foliageRadius = Math.floor(Math.random() * 2) + 7; roots = Math.random() < 0.6; spacing = 8; twisted = false; }
                else if (r < 0.30) { type = 'large'; trunkHeight = Math.floor(Math.random() * 5) + 13; foliageRadius = Math.floor(Math.random() * 2) + 5; roots = distRiver < 23 ? true : Math.random() < 0.35; spacing = 6; twisted = false; }
                else if (r < 0.55) { type = 'normal'; trunkHeight = Math.floor(Math.random() * 4) + 9; foliageRadius = Math.floor(Math.random() * 2) + 3; roots = false; spacing = 4; twisted = false; }
                else { type = 'small'; trunkHeight = Math.floor(Math.random() * 4) + 10; foliageRadius = Math.floor(Math.random() * 2) + 3; roots = false; spacing = 4; twisted = true; }
                if (!tooClose(x, z, spacing)) {
                    voxels.push(...createTree(x, z, h, trunkHeight, foliageRadius, type, roots, twisted));
                    mark(x, z, spacing);
                }
            }
        }
    }
    return voxels;
}

function createThinLilyPad(x, y, z) {
    const g = new THREE.BoxGeometry(VOXEL_SIZE, 0.15, VOXEL_SIZE);
    const m = materials.lilyPad;
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    return mesh;
}

function createLilyPad(x, z, size = 'cluster') {
    const group = new THREE.Group();
    const y = 0;
    if (size === 'single') { group.add(createThinLilyPad(x, y, z)); }
    else {
        group.add(createThinLilyPad(x, y, z));
        group.add(createThinLilyPad(x + 1, y, z));
        group.add(createThinLilyPad(x, y, z + 1));
        group.add(createThinLilyPad(x + 1, y, z + 1));
    }
    return group;
}

function createLilyPads() {
    const group = new THREE.Group();
    const pads = [
        { x: -18.5, z: 26, size: 'single' }, { x: -15, z: 27.5, size: 'cluster' }, { x: -17, z: 29, size: 'single' },
        { x: 17, z: -48, size: 'cluster' }, { x: 15.5, z: -46, size: 'single' }, { x: 18, z: -44.5, size: 'single' }
    ];
    pads.forEach(p => group.add(createLilyPad(p.x, p.z, p.size)));
    return group;
}

function buildWorld() {
    initializeInstancedMeshes();
    const terrain = createTerrain();
    const forest = populateForest(terrain.heightMap);
    addVoxelsToScene([...terrain.voxels, ...forest]);
    Object.values(instancedMeshes).forEach(bucket => bucket.meshes.forEach(mesh => { if (mesh.count > 0) { mesh.instanceMatrix.needsUpdate = true; scene.add(mesh); } }));

    const water = createWaterPlane();
    const fogLayers = createUnderwaterFogLayers();
    const lilyPads = createLilyPads();
    scene.add(fogLayers, water, lilyPads);
    if (!scene.children.includes(player)) scene.add(player);

    sceneReady = true;
    checkAndHideSpinner();

}

buildWorld();
setSkyboxFromEquirect('skybox.jpeg');

function animate() {
    requestAnimationFrame(animate);
    if (renderer.xr.isPresenting) {
        controls.enabled = false;
    } else {
        controls.enabled = true;
        controls.update();
    }
    updateXRMovement();
    renderer.render(scene, camera);
}

function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
}

window.addEventListener('resize', resize);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resize);
    window.visualViewport.addEventListener('scroll', resize);
}
resize();

const clock = new THREE.Clock();
const controllerModelFactory = new XRControllerModelFactory();
let leftController = null;
let rightController = null;
let leftProxy = null;
const stickState = { x: 0, y: 0, xSmoothed: 0, ySmoothed: 0 };
const movementParams = { speed: 8.0, flySpeed: 4.0, smoothing: 0.16 };

function setupXRControllers() {
    const controller0 = renderer.xr.getController(0);
    const controller1 = renderer.xr.getController(1);
    function onConnected(evt) {
        const handedness = evt.data.handedness || (evt.data && evt.data.handedness) || 'unknown';
        if (handedness === 'left') {
            leftController = this;
            leftProxy = new THREE.Object3D();
            leftProxy.name = 'left_proxy';
            scene.add(leftProxy);
            const grip = renderer.xr.getControllerGrip(0);
            grip.add(controllerModelFactory.createControllerModel(grip));
        } else if (handedness === 'right') {
            rightController = this;
            const grip = renderer.xr.getControllerGrip(1);
            grip.add(controllerModelFactory.createControllerModel(grip));
        }
    }
    function onDisconnected(evt) {
        if (leftController === this) leftController = null;
        if (rightController === this) rightController = null;
    }
    controller0.addEventListener('connected', onConnected);
    controller0.addEventListener('disconnected', onDisconnected);
    controller1.addEventListener('connected', onConnected);
    controller1.addEventListener('disconnected', onDisconnected);
    scene.add(controller0);
    scene.add(controller1);
    const grip0 = renderer.xr.getControllerGrip(0);
    const grip1 = renderer.xr.getControllerGrip(1);
    grip0.add(controllerModelFactory.createControllerModel(grip0));
    grip1.add(controllerModelFactory.createControllerModel(grip1));
    scene.add(grip0);
    scene.add(grip1);
}

function updateXRMovement() {
    const delta = clock.getDelta();
    if (!renderer.xr.isPresenting) return;
    if (!leftController || !leftController.inputSource || !leftController.inputSource.gamepad) {
        return;
    }
    const gp = leftController.inputSource.gamepad;
    if (!gp || !gp.axes) return;
    const axes = gp.axes;
    let ax = 0, ay = 0;
    if (axes.length >= 4) {
        ax = axes[2]; 
        ay = axes[3]; 
    } else {
        ax = axes[0];
        ay = axes[1];
    }
    stickState.xSmoothed += (ax - stickState.xSmoothed) * movementParams.smoothing;
    stickState.ySmoothed += (ay - stickState.ySmoothed) * movementParams.smoothing;

    const camQuat = camera.quaternion.clone();
    const euler = new THREE.Euler().setFromQuaternion(camQuat, 'YXZ');
    const yawQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, euler.y, 0));
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQuat).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQuat).normalize();

    const forwardSpeed = -stickState.ySmoothed * movementParams.speed * delta;
    const strafeSpeed = stickState.xSmoothed * movementParams.speed * delta;
    const flySpeedY = -stickState.ySmoothed * movementParams.flySpeed * delta * 0.5;

    const move = new THREE.Vector3();
    move.add(forward.clone().multiplyScalar(forwardSpeed));
    move.add(right.clone().multiplyScalar(strafeSpeed));
    move.y += flySpeedY;

    player.position.add(move);
}

setupXRControllers();
animate();
