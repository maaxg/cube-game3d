import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Box from "./box";
let renderer, scene, camera, cube, ground;
const enemies = [];
let frames = 0;
let spawnRate = 200;
let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);

  cube.movement();
  cube.update({ ground });
  gameOver();

  frames++;
  createEnemy();

  renderer.render(scene, camera);
}
function gameOver() {
  enemies.forEach((enemy) => {
    enemy.update({ ground, enemy: true });
    if (enemy.boxCollision({ box: cube, box1: enemy })) {
      const text = document.getElementById("gameover");
      text.style.display = "flex";

      cancelAnimationFrame(animationId);
    }
  });
}
function createGround() {
  ground = new Box({
    width: 10,
    height: 0.5,
    depth: 50,
    color: "#0369a1",
    position: {
      x: 0,
      y: -2,
      z: 0,
    },
    body: false,
  });

  ground.receiveShadow = true;

  scene.add(ground);
}

function createCube({
  enemy = false,
  position = { x: 0, y: 0, z: 0 },
  velocity = {
    x: 0,
    y: -0.01,
    z: 0,
  },
}) {
  let enemyCube;
  if (enemy) {
    enemyCube = new Box({
      velocity,
      position,
      color: enemy ? "red" : 0x00ff00,
    });
    enemyCube.castShadow = true;
  } else {
    cube = new Box({
      velocity,
      position,
      color: enemy ? "red" : 0x00ff00,
    });
    cube.castShadow = true;
  }
  if (enemy) enemies.push(enemyCube);
  scene.add(cube, enemyCube);
}

function initLight() {
  const light = new THREE.DirectionalLight(0xffffff);
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;

  scene.add(light, ambientLight);
}

function createEnemy() {
  if (frames % spawnRate === 0) {
    if (spawnRate > 20) spawnRate -= 20;
    createCube({
      enemy: true,
      position: {
        x: (Math.random() - 0.5) * 12,
        y: 0,
        z: -20,
      },
      velocity: {
        x: 0,
        y: 0,
        z: 0.005,
      },
    });
  }
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(4.61, 2.74, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  initLight();
  createGround();

  createCube({});

  camera.position.z = 5;

  scene.add(camera, controls);

  animate();
}

init();
