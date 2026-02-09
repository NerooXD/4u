let started = false;
let photoMesh;

// =====================
// START SCREEN LOGIC
// =====================
const startScreen = document.getElementById("startScreen");
startScreen.addEventListener("click", () => {
  startScreen.style.opacity = 0;
  setTimeout(() => startScreen.remove(), 600);
  started = true;
});

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 6, 12);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls (NONAKTIF sebelum klik)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enabled = false;

// Light
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// =====================
// FOTO INSTAN
// =====================
const textureLoader = new THREE.TextureLoader();

function createInstantPhoto(url) {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  frame.receiveShadow = true;
  group.add(frame);

  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;

  photoMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.8, 4.2),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7 })
  );

  photoMesh.rotation.x = -Math.PI / 2;
  photoMesh.position.set(0, 0.1, 0.08);
  photoMesh.castShadow = true;
  group.add(photoMesh);

  group.rotation.x = -Math.PI / 2;
  group.position.y = 0.02;
  return group;
}

scene.add(createInstantPhoto(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/800px-Example.jpg"
));

// =====================
// GANTI GAMBAR
// =====================
window.changePhoto = () => {
  const url = document.getElementById("imageUrl").value;
  if (!url) return;

  textureLoader.load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    photoMesh.material.map = tex;
    photoMesh.material.needsUpdate = true;
  });
};

// =====================
// BUNGA
// =====================
const petalMat = new THREE.MeshStandardMaterial({ color: 0xff6f91, roughness: 0.4 });
const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.8 });

function flower(x, z) {
  const g = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 4, 16),
    stemMat
  );
  stem.position.y = 2.2;
  stem.castShadow = true;
  g.add(stem);

  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      petalMat
    );
    const a = (i / 8) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.7, 4.3, Math.sin(a) * 0.7);
    p.scale.set(1, 0.4, 1);
    p.castShadow = true;
    g.add(p);
  }

  const c = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  c.position.y = 4.3;
  c.castShadow = true;
  g.add(c);

  g.position.set(x, 0.2, z);
  return g;
}

for (let i = 0; i < 7; i++) {
  scene.add(flower((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3));
}

// =====================
// ANIMATE
// =====================
function animate() {
  requestAnimationFrame(animate);

  if (started) {
    controls.enabled = true;
    controls.update();
  }

  renderer.render(scene, camera);
}
animate();

// Resize
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
