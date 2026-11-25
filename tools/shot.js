// node shot.js <out.png> <query>   — لقطة لصفحة الفحص
const { chromium } = require('playwright');
(async () => {
  const [out, query, waitMs] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1182, height: 1166 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('CON', m.text()));
  await p.goto('http://localhost:8765/tools/preview.html?' + query);
  await p.waitForFunction(() => document.title === 'ready', null, { timeout: 15000 });
  await p.waitForTimeout(+waitMs || 1500);
  await p.screenshot({ path: out }); await b.close();
})();
