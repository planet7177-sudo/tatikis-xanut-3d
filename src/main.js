/**
 * Tatikis Xanut 3D — entry
 */

import { Game } from './game/Game.js';

const startScreen = document.getElementById('start-screen');
const btnStart = document.getElementById('btn-start');
const canvas = document.getElementById('game-canvas');
const hud = document.getElementById('hud');

let game = null;

btnStart.addEventListener('click', async () => {
  startScreen.classList.remove('active');
  hud.classList.remove('hidden');
  canvas.requestPointerLock?.();

  game = new Game(canvas);
  await game.init();
  game.start();
});

canvas.addEventListener('click', () => {
  if (game && !document.pointerLockElement) canvas.requestPointerLock?.();
});

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.getElementById('joystick')?.classList.remove('hidden');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
