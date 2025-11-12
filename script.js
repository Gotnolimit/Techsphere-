// main background + data viz (guarded DOM queries)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer) canvasContainer.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0x00ffff, 1.2);
pointLight.position.set(10, 15, 10);
scene.add(pointLight);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1200;
const pos = new Float32Array(particlesCount * 3);
for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 80;
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

const particlesMaterial = new THREE.PointsMaterial({ size: 0.12, color: 0x00ffff, transparent: true, opacity: 0.7 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const shapes = [];
const geos = [ new THREE.BoxGeometry(2,2,2), new THREE.OctahedronGeometry(1.5), new THREE.TetrahedronGeometry(1.5) ];
for (let i=0;i<5;i++){
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness:0.6, roughness:0.4, transparent:true, opacity:0.35, emissive:0x00ffff, emissiveIntensity:0.15 });
  const m = new THREE.Mesh(geos[Math.floor(Math.random()*geos.length)], mat);
  m.position.set((Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*30);
  shapes.push(m); scene.add(m);
}
camera.position.z = 20;

// postprocess (only if composer classes loaded)
let composer = null;
try {
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.4, 0.85);
  composer.addPass(bloom);
} catch (e) {
  composer = null;
}

let mx = 0, my = 0;
document.addEventListener('mousemove', e => { mx = (e.clientX/innerWidth)*2-1; my = -(e.clientY/innerHeight)*2+1; });

let t = 0;
function loop(){
  requestAnimationFrame(loop);
  t += 0.01;
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0004;
  shapes.forEach((s,i)=>{ s.rotation.x += 0.003*(i+1); s.rotation.y += 0.003*(i+1); });
  camera.position.z = 20 + Math.sin(t)*2;
  camera.position.x += (mx*2 - camera.position.x) * 0.05;
  camera.position.y += (my*2 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  if (composer) composer.render();
  else renderer.render(scene, camera);
}
loop();

window.addEventListener('resize', () => {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
  if (composer && composer.setSize) composer.setSize(w,h);
});

// data viz (guarded)
const dataContainer = document.getElementById('data-canvas');
if (dataContainer) {
  const dataScene = new THREE.Scene();
  const dataCamera = new THREE.PerspectiveCamera(50, dataContainer.offsetWidth / 400, 0.1, 1000);
  const dataRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  dataRenderer.setSize(dataContainer.offsetWidth, 400);
  dataContainer.appendChild(dataRenderer.domElement);

  const bars = [8,12,6,15,10,9];
  const colors = [0x00ffff,0x00ccff,0x0099ff,0x0066ff,0x0099ff,0x00ccff];
  bars.forEach((h,i)=>{
    const g = new THREE.BoxGeometry(1.5,h,1.5);
    const m = new THREE.MeshStandardMaterial({ color: colors[i], metalness:0.6, roughness:0.3, emissive:0x00ffff, emissiveIntensity:0.25 });
    const bar = new THREE.Mesh(g,m);
    bar.position.set((i-2.5)*3, h/2, 0);
    dataScene.add(bar);
  });
  dataScene.add(new THREE.PointLight(0x00ffff,1.2).position.set(5,15,10));
  dataScene.add(new THREE.AmbientLight(0x0066ff,0.4));
  dataCamera.position.set(0,8,20);
  dataCamera.lookAt(0,5,0);
  (function animateData(){
    requestAnimationFrame(animateData);
    dataScene.rotation.y += 0.005;
    dataRenderer.render(dataScene, dataCamera);
  })();
}
