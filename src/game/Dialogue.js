/**
 * Armenian dialogue + Russian translation + speech
 */

const CUSTOMER_LINES = [
  { hy: 'Barev dzez, tatik jan! Mi hat gata u tarxun tveq!', ru: '\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0431\u0430\u0431\u0443\u0448\u043a\u0430 \u0434\u0436\u0430\u043d! \u0414\u0430\u0439\u0442\u0435 \u043e\u0434\u043d\u0443 \u0433\u0430\u0442\u0443 \u0438 \u0442\u0430\u0440\u0445\u0443\u043d!' },
  { hy: 'Tarm lavash ka? Qshi ara, shtapum em!', ru: '\u0421\u0432\u0435\u0436\u0438\u0439 \u043b\u0430\u0432\u0430\u0448 \u0435\u0441\u0442\u044c? \u0411\u044b\u0441\u0442\u0440\u0435\u0435 \u0434\u0430\u0432\u0430\u0439, \u0442\u043e\u0440\u043e\u043f\u043b\u044e\u0441\u044c!' },
  { hy: 'Barev, jan! Inch ka lav?', ru: '\u041f\u0440\u0438\u0432\u0435\u0442, \u0434\u0436\u0430\u043d! \u0427\u0442\u043e \u0435\u0441\u0442\u044c \u0445\u043e\u0440\u043e\u0448\u0435\u0433\u043e?' },
  { hy: 'Mi shish tarxun ev mi hat hats, xndrum em.', ru: '\u041e\u0434\u043d\u0443 \u0431\u0443\u0442\u044b\u043b\u043a\u0443 \u0442\u0430\u0440\u0445\u0443\u043d\u0430 \u0438 \u043e\u0434\u0438\u043d \u0445\u043b\u0435\u0431, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430.' },
  { hy: 'Shnorhakalutyun, tatik jan!', ru: '\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0431\u0430\u0431\u0443\u0448\u043a\u0430 \u0434\u0436\u0430\u043d!' }
];

const OWNER_LINES = {
  greet: { hy: 'Barev dzez, jan! Anush lini!', ru: '\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u0436\u0430\u043d! \u041f\u0440\u0438\u044f\u0442\u043d\u043e\u0433\u043e!' },
  lavash: { hy: 'Qshi ara! Tarm lavash ka!', ru: '\u0421\u0435\u0439\u0447\u0430\u0441! \u0421\u0432\u0435\u0436\u0438\u0439 \u043b\u0430\u0432\u0430\u0448 \u0435\u0441\u0442\u044c!' },
  debt: { hy: 'Grir tetri mej, ashxatavardzin ktam!', ru: '\u0417\u0430\u043f\u0438\u0448\u0438 \u0432 \u0442\u0435\u0442\u0440\u0430\u0434\u043a\u0443, \u0441 \u0437\u0430\u0440\u043f\u043b\u0430\u0442\u044b \u043e\u0442\u0434\u0430\u043c!' }
};

export class Dialogue {
  constructor(game) {
    this.game = game;
    this.el = document.getElementById('speech');
    this.hyEl = document.getElementById('speech-hy');
    this.ruEl = document.getElementById('speech-ru');
    this.timer = null;
  }

  show(hy, ru, duration = 4500) {
    this.hyEl.textContent = hy;
    this.ruEl.textContent = ru;
    this.el.classList.remove('hidden');
    this.speak(hy);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.add('hidden'), duration);
  }

  speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const hyVoice = voices.find(v => v.lang.startsWith('hy') || v.lang.includes('Armenian'));
    if (hyVoice) u.voice = hyVoice;
    u.lang = 'hy-AM';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  sayOwner(key) {
    const line = OWNER_LINES[key];
    if (line) this.show(line.hy, line.ru);
  }

  customerThanks(price) {
    const line = CUSTOMER_LINES[Math.floor(Math.random() * CUSTOMER_LINES.length)];
    this.show(line.hy + ` (${price} \u058F)`, line.ru + ` \u2014 ${price} \u0434\u0440\u0430\u043c\u043e\u0432`);
  }

  startAmbient() {
    const loop = () => {
      if (Math.random() > 0.4) {
        const line = CUSTOMER_LINES[Math.floor(Math.random() * 3)];
        this.show(line.hy, line.ru, 4000);
      }
      setTimeout(loop, 12000 + Math.random() * 10000);
    };
    setTimeout(loop, 5000);
  }
}
