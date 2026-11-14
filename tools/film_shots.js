// يشغّل حكاية كاملة بمقاس الجوال ويلتقط كل مشهد + الاختيار + النهاية، ثم يجمعها في صورة واحدة.
// الاستعمال (والخادم يعمل: python3 -m http.server 8765): node tools/film_shots.js <story-id> <out.png>
const { chromium } = require('playwright');
(async () => {
  const [id, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => localStorage.setItem('hikaya-siraj:v1', JSON.stringify({ name: 'سعد', sound: false })));
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:8765/#/stories/' + id);
  await p.waitForSelector('.fcard--title button'); await p.waitForTimeout(1600);
  const shots = [await p.screenshot()];
  await p.click('.fcard--title button');
  const story = await p.evaluate(async i => (await (await fetch('content/stories.json')).json()).stories.find(s => s.id === i), id);
  const right = story.choice.options.find(o => o.correct).text;
  for (let n = 0; n < 12; n++) {
    await p.waitForTimeout(7000);
    if (await p.$('.fcard--end')) { await p.waitForTimeout(1500); shots.push(await p.screenshot()); break; }
    if (await p.$('.fcard--choice')) {
      shots.push(await p.screenshot());
      for (const o of await p.$$('.opt')) if ((await o.textContent()) === right) await o.click();
      await p.waitForTimeout(2600); shots.push(await p.screenshot()); await p.waitForTimeout(1500); continue;
    }
    await p.click('.film__text', { force: true }); await p.waitForTimeout(300);
    shots.push(await p.screenshot());
    await p.click('.film__next', { force: true });
  }
  const page2 = await ctx.newPage();
  await page2.setViewportSize({ width: Math.min(shots.length, 5) * 394, height: Math.ceil(shots.length / 5) * 848 });
  const imgs = shots.map(s => '<img width=390 src="data:image/png;base64,' + s.toString('base64') + '">').join('');
  await page2.setContent('<body style="margin:0;background:#333;display:grid;grid-template-columns:repeat(5,390px);gap:4px">' + imgs + '</body>');
  await page2.screenshot({ path: out });
  console.log(shots.length, 'لقطات', errs.length ? 'أخطاء: ' + errs.join(' | ') : 'بلا أخطاء');
  await b.close();
})();
