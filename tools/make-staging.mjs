// Builds the staging copy of the site for https://staging.quizzifytech.com
//   node tools/make-staging.mjs <outDir>
// Copies the site into <outDir> and changes only what staging needs:
//   - no AdSense: removes the adsbygoogle.js script and google-adsense-account meta
//   - no ads.txt, no sitemap.xml, no CNAME (the staging domain is set in repo settings)
//   - robots.txt blocks everything, every page gets <meta name="robots" content="noindex, nofollow">
//   - a small "STAGING" badge on every page so it is never confused with the live site
// Analytics already skip this host (index.html TRACK_HOSTS and gtm.js only list the live hosts).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const out = process.argv[2] && resolve(process.argv[2]);
if (!out) { console.error('usage: node tools/make-staging.mjs <outDir>'); process.exit(1); }

const SKIP = new Set(['.git', '.github', 'tools', 'supabase', 'node_modules', 'CNAME', 'ads.txt', 'sitemap.xml', 'README.md']);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const name of readdirSync(root)) {
  if (SKIP.has(name) || resolve(root, name) === out) continue;
  cpSync(join(root, name), join(out, name), { recursive: true });
}

writeFileSync(join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const BADGE = '<div id="qt-staging" style="position:fixed;left:8px;bottom:8px;z-index:2147483647;' +
  'background:#b91c1c;color:#fff;font:700 11px/1 system-ui,sans-serif;letter-spacing:.08em;' +
  'padding:6px 9px;border-radius:6px;pointer-events:none;opacity:.9">STAGING</div>';

let pages = 0, adsRemoved = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.html')) continue;
    let html = readFileSync(p, 'utf8');
    const before = html.length;
    html = html
      .replace(/<script[^>]*pagead2\.googlesyndication\.com[^>]*><\/script>\s*/gi, '')
      .replace(/<meta[^>]*name=["']?google-adsense-account["']?[^>]*>\s*/gi, '')
      .replace(/<meta[^>]*name=["']?robots["']?[^>]*>/gi, '');
    if (html.length !== before) adsRemoved++;
    html = html.replace(/<head([^>]*)>/i, '<head$1><meta name="robots" content="noindex, nofollow">');
    html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, BADGE + '</body>') : html + BADGE;
    if (/googlesyndication|ca-pub-/i.test(html)) throw new Error('AdSense still present in ' + relative(out, p));
    writeFileSync(p, html);
    pages++;
  }
}
walk(out);
for (const f of ['ads.txt', 'CNAME', 'sitemap.xml']) if (existsSync(join(out, f))) throw new Error(f + ' must not be on staging');
console.log(`staging build: ${pages} pages, AdSense/robots tags removed from ${adsRemoved}, noindex + badge on all`);
