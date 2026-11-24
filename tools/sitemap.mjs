// Writes sitemap.xml from the pages on disk: the fixed pages, every Bug library page and every article.
// Used by tools/build-bugs.mjs and tools/build-articles.mjs, so either one keeps the whole sitemap complete.
import fs from 'node:fs';

const SITE = 'https://quizzifytech.com/';
const list = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html').sort() : [];

export function writeSitemap(bugIds) {
  const bugs = bugIds ? bugIds.map(id => id + '.html') : list('bugs');
  const urls = [['', 'daily', '1.0'], ['articles/', 'weekly', '0.8'], ['bugs/', 'weekly', '0.8'], ['about.html', 'monthly', '0.6'], ['contact.html', 'yearly', '0.4'], ['privacy.html', 'yearly', '0.3'], ['terms.html', 'yearly', '0.3']]
    .concat(list('articles').map(f => ['articles/' + f, 'monthly', '0.7']))
    .concat(bugs.map(f => ['bugs/' + f, 'monthly', '0.6']));
  fs.writeFileSync('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(([u, f, pr]) => `  <url><loc>${SITE}${u}</loc><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join('\n') + '\n</urlset>\n');
  return urls.length;
}
