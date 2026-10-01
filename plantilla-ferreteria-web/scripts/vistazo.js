const { servidor, navegador, contexto, URL } = require('./arnes');
(async () => {
  const s = await servidor(); const nav = await navegador();
  for (const [nom, vp, mov] of [['esc', { width: 1440, height: 900 }, false], ['mov', { width: 390, height: 844 }, true]]) {
    const ctx = await contexto(nav, { ctx: { viewport: vp, isMobile: mov, hasTouch: mov } });
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
    p.on('requestfailed', r => errs.push('FALLO ' + r.url())); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
    await p.goto(URL + (process.argv[2] || ''), { waitUntil: 'load' });
    await p.waitForTimeout(3500);
    await p.screenshot({ path: `/tmp/claude-0/-home-user-plantillas-negocios-web/5172b210-700e-5cac-b006-6d7c8ee4dc16/scratchpad/v-${nom}-0.png` });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let i = 1;
    for (let y = 0; y < H; y += vp.height * 0.9) {
      await p.mouse.wheel(0, vp.height * 0.9); await p.waitForTimeout(900);
      if (i <= 14) await p.screenshot({ path: `/tmp/claude-0/-home-user-plantillas-negocios-web/5172b210-700e-5cac-b006-6d7c8ee4dc16/scratchpad/v-${nom}-${i}.png` });
      i++;
    }
    console.log(nom, 'altura', H, 'errores', errs);
    await ctx.close();
  }
  await nav.close(); s.close();
})();
