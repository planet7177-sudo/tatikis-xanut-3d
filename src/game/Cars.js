/**
 * 3D cars on the street
 */
import * as THREE from 'three';

export class Cars {
  constructor(scene) {
    this.scene = scene;
    this.list = [];
  }

  spawn() {
    const colors = [0xef4444, 0x3b82f6, 0xffffff, 0x22c55e, 0x1e293b, 0xf59e0b, 0xa855f7];
    for (let i = 0; i < 7; i++) {
      const car = this.createCar(colors[i % colors.length]);
      const lane = i % 2 === 0 ? 1 : -1;
      car.group.position.set(-20 + i * 7, 0.35, 10 + lane * 1.8);
      car.speed = (1.8 + Math.random() * 1.5) * (lane > 0 ? 1 : -1);
      car.group.rotation.y = lane > 0 ? 0 : Math.PI;
      this.list.push(car);
      this.scene.add(car.group);
    }
  }

  createCar(color) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.55, 1.1),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
    );
    body.position.y = 0.15;
    body.castShadow = true;
    group.add(body);
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.45, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    cabin.position.set(-0.15, 0.55, 0);
    cabin.castShadow = true;
    group.add(cabin);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 10);
    [[0.7, -0.15, 0.55], [0.7, -0.15, -0.55], [-0.7, -0.15, 0.55], [-0.7, -0.15, -0.55]].forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, y, z);
      group.add(w);
    });
    return { group, speed: 2 };
  }

  update(dt) {
    this.list.forEach(car => {
      car.group.position.x += car.speed * dt;
      if (car.speed > 0 && car.group.position.x > 28) car.group.position.x = -28;
      if (car.speed < 0 && car.group.position.x < -28) car.group.position.x = 28;
    });
  }
}
