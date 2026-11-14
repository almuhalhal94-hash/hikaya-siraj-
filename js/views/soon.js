// صفحة مؤقتة للأبواب التي لم تُبنَ بعد: سِراج يعتذر بلطف ويعيد الطفل للأبواب.
import { store, fill, html } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

export default async function soon(el, { ui, go }) {
  const siraj = createSiraj({ label: ui.common.siraj });
  const page = html(`<section class="soon"><a class="btn" href="#/"></a></section>`);
  const back = page.querySelector('a');
  back.textContent = ui.soon.back;
  back.addEventListener('click', e => { e.preventDefault(); sfx.tap(); go('#/'); });
  page.prepend(siraj.el);
  el.append(page);
  siraj.say(fill(ui.soon.text, { name: store.state.name }));
  siraj.lantern.addEventListener('click', () => { sfx.star(); siraj.react('joy'); sparkle(siraj.lantern, { count: 10, power: 3 }); });
}
