import * as THREE from "three";

const GRAVITY = -0.002;
class Box extends THREE.Mesh {
  constructor({
    width = 1,
    height = 1,
    depth = 1,
    color = 0x00ff00,
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    );
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.velocity = velocity;
  }

  applyGravity({ ground }) {
    this.velocity.y += GRAVITY;

    // ground colision
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= 0.8;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }

  update({ ground }) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.applyGravity({ ground });
  }
}

export default Box;
