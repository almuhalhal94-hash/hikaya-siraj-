// نقطة البداية: الموجّه (hash router)، الانتقالات بين الصفحات، وشريط الأعلى.
import { store, content, dayPart, wait, reducedMotion, touchDay } from './core.js';
import { initSky, initFx, setKidStars } from './sky.js';
import { sfx, setSound } from './audio.js';
import home from './views/home.js';
import soon from './views/soon.js';
import stories from './views/stories.js';
import adhkar from './views/adhkar.js';
import games from './views/games.js';
import house from './views/house.js';

// كل قسم يُسجَّل هنا عند بنائه؛ ما لم يُبنَ بعد يعرض صفحة «قريبًا».
const routes = { '': home, stories, games, adhkar, house };

const view = document.getElementById('view');
const veil = document.getElementById('veil');
const soundBtn = document.getElementById('soundBtn');
const nameChip = document.getElementById('nameChip');
let ctx, cleanup, rendering = Promise.resolve();

function refreshChip() {
  nameChip.hidden = !store.state.name;
  nameChip.textContent = store.state.name;
}

function refreshSound() {
  const on = store.state.sound;
  soundBtn.setAttribute('aria-pressed', on);
  soundBtn.setAttribute('aria-label', on ? ctx.ui.common.sound_on : ctx.ui.common.sound_off);
}

async function render() {
  const [name, ...args] = location.hash.replace(/^#\/?/, '').split('/');
  const mount = routes[name] || home;
  document.body.dataset.route = routes[name] ? name || 'home' : 'home';
  view.classList.add('is-leaving');
  await wait(reducedMotion() ? 0 : 200);
  if (cleanup) cleanup();
  view.textContent = '';
  window.scrollTo(0, 0);
  setKidStars(store.state.stars);
  cleanup = await mount(view, { ...ctx, args });
  view.classList.remove('is-leaving');
}

const queueRender = () => (rendering = rendering.then(render).catch(console.error));

/** انتقال «دخول الباب»: نور يتسع من العنصر ثم تظهر الصفحة الجديدة. */
async function go(hash, origin) {
  if (location.hash === hash || (hash === '#/' && !location.hash)) return;
  if (!origin || reducedMotion()) { location.hash = hash; return; }
  const b = origin.getBoundingClientRect();
  veil.style.setProperty('--x', `${b.left + b.width / 2}px`);
  veil.style.setProperty('--y', `${b.top + b.height / 2}px`);
  veil.className = 'is-on';
  await wait(520);
  location.hash = hash;
  await wait(60);
  await rendering;
  veil.className = 'is-on is-off';
  await wait(450);
  veil.className = '';
}

async function start() {
  document.documentElement.dataset.time = dayPart();
  touchDay();
  initSky(document.getElementById('sky'));
  initFx(document.getElementById('fx'));

  const [ui, lines] = await Promise.all([content('ui'), content('siraj')]);
  ctx = { ui, lines, go, refreshChip };

  document.getElementById('brandName').textContent = ui.brand.name;
  document.querySelector('.brand').setAttribute('aria-label', ui.common.home);
  nameChip.setAttribute('aria-label', ui.home.name_change);
  refreshChip(); refreshSound();

  soundBtn.addEventListener('click', () => { setSound(!store.state.sound); refreshSound(); });
  nameChip.addEventListener('click', async () => {
    if (document.body.dataset.route !== 'home') { location.hash = '#/'; await wait(80); await rendering; }
    document.dispatchEvent(new CustomEvent('siraj:rename'));
  });
  // نقرة خفيفة على كل زر ورابط عام
  document.addEventListener('click', e => { if (e.target.closest('.brand, .chip')) sfx.tap(); });

  window.addEventListener('hashchange', queueRender);
  await queueRender();
  document.body.classList.add('is-ready');
}

start().catch(err => {
  console.error(err);
  document.body.classList.add('is-ready');
});
