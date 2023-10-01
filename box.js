import * as THREE from "three";
const GRAVITY = -0.002;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

class Box extends THREE.Mesh {
  constructor({
    width = 1,
    height = 1,
    depth = 1,
    color = 0x00ff00,
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
    body = true,
    geometry = new THREE.BoxGeometry(width, height, depth),
  }) {
    super(geometry, new THREE.MeshStandardMaterial({ color }));
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;

    this.position.set(position.x, position.y, position.z);

    this.updateSides();

    this.velocity = velocity;
    this.body = body;
    if (this.body) this.movementListener();
  }

  movement() {
    if (!this.body) return;
    this.velocity.x = 0;

    if (keys.a.pressed) this.velocity.x = -0.05;
    if (keys.d.pressed) this.velocity.x = 0.05;
    if (keys.space.pressed) this.velocity.y = 0.05;
  }

  movementListener() {
    window.addEventListener("keydown", (ev) => {
      console.log(ev.code);
      switch (ev.code) {
        case "KeyA":
        case "ArrowLeft":
          keys.a.pressed = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.d.pressed = true;
          break;
        case "Space":
          keys.space.pressed = true;
          break;
      }
    });
    window.addEventListener("keyup", (ev) => {
      switch (ev.code) {
        case "KeyA":
        case "ArrowLeft":
          keys.a.pressed = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.d.pressed = false;
          break;
        case "Space":
          keys.space.pressed = false;
          break;
      }
    });
  }

  updateSides() {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  applyGravity({ ground }) {
    this.velocity.y += GRAVITY;

    // ground colision
    if (this.boxCollision({ box: this, box1: ground })) {
      const friction = 0.5;
      this.velocity.y *= friction;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }

  boxCollision({ box, box1 }) {
    const xCollision = box.right >= box1.left && box.left <= box1.right;
    const yCollision =
      box.bottom + box.velocity.y <= box1.top && box.top >= box1.bottom;
    const zCollision = box.front >= box1.back && box.back <= box1.front;

    return xCollision && yCollision && zCollision;
  }

  update({ ground, enemy }) {
    this.updateSides();

    if (enemy) this.velocity.z += 0.0003;

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    // this.position.y += this.velocity.y;

    this.applyGravity({ ground });
  }
}

export default Box;
