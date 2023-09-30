import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Box from "./box";

let renderer, scene, camera, cube, ground;

function animate() {
  requestAnimationFrame(animate);
  //  cube.position.y -= 0.01;
  cube.update({ ground });

  renderer.render(scene, camera);
}

function createGround() {
  ground = new Box({
    width: 5,
    height: 0.5,
    depth: 10,
    color: 0x0000ff,
    position: {
      x: 0,
      y: -2,
      z: 0,
    },
  });

  ground.receiveShadow = true;

  scene.add(ground);
}

function createCube() {
  cube = new Box({
    velocity: {
      x: 0,
      y: -0.01,
      z: 0,
    },
  });
  cube.castShadow = true;

  scene.add(cube);
}

function initLight() {
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;

  scene.add(light);
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  initLight();
  createGround();
  createCube();

  camera.position.z = 5;

  scene.add(camera, controls);

  animate();
}

init();
