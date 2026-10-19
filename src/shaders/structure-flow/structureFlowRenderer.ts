import * as THREE from "three";

export type StructureFlowOptions = { speed: number; pointSize: number; opacity: number; maskStart: number; maskSolid: number };
export const STRUCTURE_FLOW_DEFAULTS: StructureFlowOptions = { speed: 1, pointSize: 0.08, opacity: 0.4, maskStart: 0.2, maskSolid: 0.5 };

export function createStructureFlowRenderer(canvas: HTMLCanvasElement, getOptions: () => StructureFlowOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = 0;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const geometry = new THREE.BufferGeometry();
  const count = 15000;
  const positions = new Float32Array(count * 3);
  const radius = 15;
  for (let index = 0; index < count; index += 1) {
    const u = Math.random();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi);
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return {
    resize(width: number, height: number) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    render() {
      const options = getOptions();
      particles.rotation.y += 0.0008 * options.speed;
      material.size = options.pointSize;
      material.opacity = options.opacity;
      renderer.render(scene, camera);
    },
    dispose() { geometry.dispose(); material.dispose(); renderer.dispose(); },
  };
}
