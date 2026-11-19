/**
 * First-person controller (eye height 1.65m)
 */

import * as THREE from 'three';

export class Player {
  constructor(camera, canvas, game) {
    this.camera = camera;
    this.canvas = canvas;
    this.game = game;
    this.keys = {};
    this.speed = 4.2;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.sensitivity = 0.0022;
    this.isMoving = false;
    this.mobileInput = { x: 0, y: 0 };

    this._onKeyDown = e => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE') this.game.serveCustomer();
    };
    this._onKeyUp = e => { this.keys[e.code] = false; };
    this._onMouseMove = e => {
      if (document.pointerLockElement !== this.canvas) return;
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= e.movementX * this.sensitivity;
      this.euler.x -= e.movementY * this.sensitivity;
      this.euler.x = Math.max(-1.2, Math.min(1.2, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    };
    this.setupJoystick();
  }

  enable() {
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  setupJoystick() {
    const stick = document.getElementById('joy-stick');
    const base = stick?.parentElement;
    if (!base) return;
    let active = false;
    let origin = { x: 0, y: 0 };
    const pos = e => {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    };
    const start = e => {
      e.preventDefault();
      active = true;
      const r = base.getBoundingClientRect();
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      move(e);
    };
    const move = e => {
      if (!active) return;
      e.preventDefault();
      const p = pos(e);
      let dx = p.x - origin.x, dy = p.y - origin.y;
      const max = 35;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d > max) { dx = dx / d * max; dy = dy / d * max; }
      stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      this.mobileInput.x = dx / max;
      this.mobileInput.y = -dy / max;
    };
    const end = () => {
      active = false;
      stick.style.transform = 'translate(-50%, -50%)';
      this.mobileInput.x = 0;
      this.mobileInput.y = 0;
    };
    base.addEventListener('touchstart', start, { passive: false });
    base.addEventListener('touchmove', move, { passive: false });
    base.addEventListener('touchend', end);
  }

  update(dt) {
    let dx = 0, dz = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) dz -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dz += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;
    dx += this.mobileInput.x;
    dz -= this.mobileInput.y;
    this.isMoving = (dx !== 0 || dz !== 0);
    if (this.isMoving) {
      const len = Math.sqrt(dx * dx + dz * dz) || 1;
      dx /= len; dz /= len;
      const yaw = this.euler.y;
      const sin = Math.sin(yaw), cos = Math.cos(yaw);
      this.camera.position.x += (dx * cos + dz * sin) * this.speed * dt;
      this.camera.position.z += (-dx * sin + dz * cos) * this.speed * dt;
    }
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -4.5, 4.5);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -3.5, 6.5);
  }
}
