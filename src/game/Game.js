/**
 * Tatikis Xanut 3D — core game
 */

import * as THREE from 'three';
import { Shop } from './Shop.js';
import { Player } from './Player.js';
import { Customers } from './Customers.js';
import { Cars } from './Cars.js';
import { Dialogue } from './Dialogue.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.running = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.shop = null;
    this.player = null;
    this.customers = null;
    this.cars = null;
    this.dialogue = null;
    this.cash = 15000;
    this.sold = 0;
    this.stock = 24;
    this._bobPhase = 0;
  }

  async init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: true, powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87b8d8);
    this.scene.fog = new THREE.FogExp2(0xb8cfe0, 0.012);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.65, 3);

    const ambient = new THREE.AmbientLight(0xfff0e0, 0.5);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffe4c4, 1.0);
    sun.position.set(15, 25, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    this.scene.add(sun);

    const lamp = new THREE.PointLight(0xffd89b, 1.2, 12);
    lamp.position.set(0, 3.2, 1);
    lamp.castShadow = true;
    this.scene.add(lamp);

    this.shop = new Shop(this.scene);
    this.shop.build();
    this.customers = new Customers(this.scene);
    this.customers.spawn();
    this.cars = new Cars(this.scene);
    this.cars.spawn();
    this.player = new Player(this.camera, this.canvas, this);
    this.player.enable();
    this.dialogue = new Dialogue(this);
    this.dialogue.startAmbient();
    this.bindUI();
    this.updateHUD();
    window.addEventListener('resize', () => this.onResize());
  }

  bindUI() {
    document.getElementById('btn-serve')?.addEventListener('click', () => this.serveCustomer());
    document.getElementById('btn-restock')?.addEventListener('click', () => this.restock());
    document.querySelectorAll('[data-phrase]').forEach(btn => {
      btn.addEventListener('click', () => this.dialogue.sayOwner(btn.dataset.phrase));
    });
  }

  start() {
    this.running = true;
    this.clock.start();
    this.animate();
  }

  animate() {
    if (!this.running) return;
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.player.update(dt);
    this.customers.update(dt);
    this.cars.update(dt);
    if (this.player.isMoving) {
      this._bobPhase += dt * 10;
      this.camera.position.y = 1.65 + Math.sin(this._bobPhase) * 0.03;
    } else {
      this.camera.position.y = 1.65;
    }
    this.renderer.render(this.scene, this.camera);
  }

  serveCustomer() {
    if (this.stock <= 0) {
      this.dialogue.show('Ապրանք չկա…', 'Товара нет… Закупите!');
      return;
    }
    const price = 900 + Math.floor(Math.random() * 800);
    this.stock -= 1;
    this.cash += price;
    this.sold += 1;
    this.updateHUD();
    this.dialogue.customerThanks(price);
    this.playBeep();
  }

  restock() {
    if (this.cash < 2000) {
      this.dialogue.show('Փող չկա…', 'Не хватает денег на закупку');
      return;
    }
    this.cash -= 2000;
    this.stock += 12;
    this.updateHUD();
    this.dialogue.show('Ապրանքը բերվեց!', 'Товар привезли! +12 на полки');
  }

  updateHUD() {
    document.getElementById('cash').textContent = this.cash.toLocaleString('ru-RU');
    document.getElementById('sold').textContent = this.sold;
    document.getElementById('stock').textContent = this.stock;
  }

  playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
