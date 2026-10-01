// Comprueba, contra los archivos reales, la receta del README para quitar el
// mando de demostración. Trabaja sobre una copia en una carpeta temporal:
// anclas exactas (sin comodines), una sola aparición de cada ancla, y se niega
// a escribir si un archivo pierde más líneas de las previstas.
// Uso: node scripts/receta-mando.js   (con PF_LIBS para abrir la copia en Chromium)
const fs = require('fs'), path = require('path'), os = require('os');
const RAIZ = path.resolve(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'receta-'));
const COPIA = path.join(TMP, 'plantilla-ferreteria-web');
fs.cpSync(RAIZ, COPIA, { recursive: true, filter: s => !/screenshots|node_modules/.test(s) });

function quitarEntre(archivo, desde, hasta, incluirHasta, maxLineas) {
  const f = path.join(COPIA, archivo);
  const s = fs.readFileSync(f, 'utf8');
  if (s.includes('\r\n')) throw new Error(archivo + ': CRLF, las anclas no casarían');
  const a = s.indexOf(desde);
  if (a < 0 || s.indexOf(desde, a + 1) >= 0) throw new Error(archivo + ': el ancla de inicio no aparece exactamente una vez: ' + desde);
  const b0 = s.indexOf(hasta, a);
  if (b0 < 0) throw new Error(archivo + ': no aparece el ancla de fin: ' + hasta);
  const b = incluirHasta ? b0 + hasta.length : b0;
  const fuera = s.slice(a, b).split('\n').length - 1;
  if (fuera > maxLineas) throw new Error(archivo + `: se iban a quitar ${fuera} líneas (máximo previsto ${maxLineas})`);
  fs.writeFileSync(f, s.slice(0, a) + s.slice(b));
  console.log(`✔ ${archivo}: quitadas ${fuera} líneas`);
}
function cambiar(archivo, de, a) {
  const f = path.join(COPIA, archivo); const s = fs.readFileSync(f, 'utf8');
  if (s.split(de).length !== 2) throw new Error(archivo + ': el texto a cambiar no aparece exactamente una vez: ' + de);
  fs.writeFileSync(f, s.replace(de, a)); console.log(`✔ ${archivo}: texto cambiado`);
}

// Paso 1 · index.html: el bloque try del script del <head> y el <div class="mando">
quitarEntre('index.html', '      try {\n        if (/[?&]revision\\b/', '      } catch (e) {}\n', true, 12);
quitarEntre('index.html', '  <!-- MANDO DE DEMOSTRACIÓN (densidad y paleta).', '  <div class="cursor"', false, 18);
// Paso 2 · css/styles.css: paletas del mando y estilos del mando
quitarEntre('css/styles.css', '/* MANDO DE DEMOSTRACIÓN · paletas derivadas', '/* FIN paletas del mando */\n', true, 6);
quitarEntre('css/styles.css', '/* ---------- MANDO DE DEMOSTRACIÓN (no viaja al cliente) ---------- */', '/* FIN mando */\n', true, 14);
// Paso 3 · js/main.js: el manejador del mando
quitarEntre('js/main.js', '  /* MANDO DE DEMOSTRACIÓN — no viaja', '  /* FIN mando */\n', true, 32);
// Paso 4 · textos que mencionan el mando
cambiar('index.html', ' (y, en modo revisión, la versión elegida en el mando)', '');
quitarEntre('legal.html', '        <li><code>pasofino-maqueta</code>', '</li>\n', true, 1);

(async () => {
  if (!process.env.PF_LIBS) { console.log('Sin PF_LIBS: solo se comprobó la edición de texto.'); return; }
  // Abrir la copia y comprobar que funciona sin el mando
  process.chdir(COPIA);
  const arnes = require(path.join(COPIA, 'scripts/arnes.js'));
  const s = await arnes.servidor(8766); const nav = await arnes.navegador();
  const ctx = await arnes.contexto(nav, { ctx: { viewport: { width: 1440, height: 900 } } });
  const p = await ctx.newPage(); const errores = [];
  p.on('pageerror', e => errores.push(String(e))); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto('http://127.0.0.1:8766/plantilla-ferreteria-web/?revision', { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  await p.click('#cookies-ok');
  const r = await p.evaluate(() => ({ mando: !!document.getElementById('mando'), clase: document.documentElement.className, cursor: !!document.querySelector('.cursor') }));
  const ok = !r.mando && /d-rosca/.test(r.clase) && /p-minio/.test(r.clase) && !/es-revision/.test(r.clase) && errores.length === 0;
  console.log((ok ? '✔' : '✘') + ' La copia sin mando carga limpia', JSON.stringify(r), errores);
  await nav.close(); s.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(ok ? 0 : 1);
})();
