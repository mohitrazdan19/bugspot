// Builds the Articles section: articles/index.html plus one page per article, and refreshes sitemap.xml.
// Run from the repo root after adding or editing an article:  node tools/build-articles.mjs
// Each article lives in tools/articles/<slug>.mjs (see the README there). No packages needed.
//
// Inside an article body you can use:
//   {{bug:<puzzle id>}}  a "Real example" card linking to the Bug library page and the playable puzzle
//   {{try}}              the "Play today's quiz" banner
import fs from 'node:fs';
import vm from 'node:vm';
import { writeSitemap } from './sitemap.mjs';

const SITE = 'https://quizzifytech.com/';
const src = fs.readFileSync('index.html', 'utf8');
const start = src.indexOf('<script>\n// Each puzzle is a fake app screen');
const end = src.indexOf("'use strict';", start);
if (start < 0 || end < 0) throw new Error('Could not find the puzzle data in index.html');
const ctx = {};
vm.runInNewContext(src.slice(start + '<script>'.length, end) + '\n;this.PUZZLES = PUZZLES;', ctx);
const BUGS = Object.fromEntries(ctx.PUZZLES.map(p => [p.id, p]));

const DIFF = { Easy: 'Beginner', Medium: 'Intermediate', Hard: 'Experienced' };
const SEV = { P1: 'Critical', P2: 'Major', P3: 'Minor', P4: 'Cosmetic' };
// Topics, in the order the filter buttons show them. Only topics with at least one article get a button.
const TOPICS = { frontend: 'Frontend', api: 'API testing', backend: 'Backend', database: 'Database', ai: 'AI testing', basics: 'Testing basics' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const ICON = {
  api: `<svg viewBox="0 0 24 24" ${S}><path d="M8 4c-2 0-2.5 1-2.5 2.5v2.3c0 1.2-.8 2.2-2 2.2 1.2 0 2 1 2 2.2v2.3C5.5 19 6 20 8 20M16 4c2 0 2.5 1 2.5 2.5v2.3c0 1.2.8 2.2 2 2.2-1.2 0-2 1-2 2.2v2.3C18.5 19 18 20 16 20"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>`,
  frontend: `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="4" width="18" height="14" rx="2.5"/><path d="M3 8h18M7 13h5M7 15.5h8M9 21h6"/></svg>`,
  backend: `<svg viewBox="0 0 24 24" ${S}><rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01M12 10v4"/></svg>`,
  database: `<svg viewBox="0 0 24 24" ${S}><ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"/></svg>`,
  ai: `<svg viewBox="0 0 24 24" ${S}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>`,
  basics: `<svg viewBox="0 0 24 24" ${S}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/><path d="M7 8h1.5M7 11h1.5M15.5 8H17M15.5 11H17"/></svg>`,
};
const cover = (t, label) => `<div class="cover c-${t === 'basics' ? 'career' : t}">${ICON[t]}${label ? `<b>${esc(TOPICS[t])}</b>` : ''}</div>`;

const FAV = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Crect width=%2724%27 height=%2724%27 rx=%276%27 fill=%27%23d6283a%27/%3E%3Cpath fill=%27%23fff%27 d=%27M12 8.2c-2.6 0-4.4 1.9-4.4 4.6S9.4 19 12 19s4.4-3.6 4.4-6.2S14.6 8.2 12 8.2Z%27/%3E%3C/svg%3E";
const adsStart = src.indexOf('<meta name="google-adsense-account"');
const ADS = adsStart < 0 ? '' : src.slice(adsStart, src.indexOf('</script>', adsStart) + '</script>'.length);
const LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 8.2c-2.6 0-4.4 1.9-4.4 4.6S9.4 19 12 19s4.4-3.6 4.4-6.2S14.6 8.2 12 8.2Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M12 8.2V19M9.3 6.4a2.7 2.7 0 0 1 5.4 0M7.6 12.3 4 10.6M16.4 12.3 20 10.6M8 16.4l-3.4 1.6M16 16.4l3.4 1.6"/></svg>';
const HEADER = `<header class="top"><a class="brand" href="/">${LOGO}QuizzifyTech</a><nav class="topnav"><a class="lnk" href="/bugs/">Bug library</a><a class="lnk" href="/articles/" aria-current="page">Articles</a><a class="play" href="/">Play today’s quiz</a></nav></header>`;
const FOOT = `<footer class="site">
  <nav aria-label="Site"><a href="/">Play</a><a href="/articles/">Articles</a><a href="/bugs/">Bug library</a><a href="/about.html">About</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms</a><a href="/contact.html">Contact</a></nav>
  <p>© 2026 QuizzifyTech. Free daily tech quizzes for testers and developers.</p>
</footer>`;
const ORG = { '@type': 'Organization', name: 'QuizzifyTech', url: SITE };

function page({ path, title, desc, type = 'website', ld = [], wide, body, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | QuizzifyTech</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="QuizzifyTech">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}og.png">
<meta name="twitter:card" content="summary_large_image">
${extraHead}<link rel="icon" href="${FAV}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/pages.css">
${ld.map(x => '<script type="application/ld+json">' + JSON.stringify(x) + '</script>\n').join('')}<script src="/gtm.js"></script>
${ADS}
</head>
<body>
<div class="bg" aria-hidden="true"><i></i><i></i></div>
<div class="wrap${wide ? ' wide' : ''}">
${HEADER}
${body}
${FOOT}
</div>
<script src="/notice.js" defer></script>
</body>
</html>
`;
}

function bugCard(id) {
  const p = BUGS[id];
  if (!p) throw new Error('Unknown puzzle id in {{bug:' + id + '}}');
  return `<div class="example"><span class="lbl">Real example</span><a class="t" href="/bugs/${id}.html">${esc(p.rep.title)}<br><span class="byline">${p.sev} · ${SEV[p.sev]} · ${DIFF[p.diff]}</span></a><a class="go" href="/?p=${id}">Spot this bug →</a></div>`;
}
const TRY = `<div class="tryit"><span class="bugicon">${LOGO}</span><p><strong>Think you would catch these?</strong><br>Today’s quiz hides 8 bugs in fake app screens. Free, no sign-up.</p><a class="play" href="/">Play today’s quiz</a></div>`;

const files = fs.readdirSync('tools/articles').filter(f => f.endsWith('.mjs')).sort();
const ARTICLES = [];
for (const f of files) {
  const a = (await import('./articles/' + f)).default;
  for (const k of ['slug', 'title', 'description', 'topic', 'published', 'lede', 'body']) if (!a[k]) throw new Error(f + ': missing ' + k);
  if (!TOPICS[a.topic]) throw new Error(f + ': unknown topic ' + a.topic);
  if (a.description.length > 160) console.warn(`warning: ${f} description is ${a.description.length} chars (Google shows about 155)`);
  const body = a.body.replace(/\{\{bug:([\w-]+)\}\}/g, (_, id) => bugCard(id)).replace(/\{\{try\}\}/g, TRY);
  const words = (body.replace(/<[^>]+>/g, ' ') + ' ' + (a.faq || []).flat().join(' ')).split(/\s+/).filter(Boolean).length;
  ARTICLES.push({ ...a, html: body, words, mins: Math.max(3, Math.round(words / 200)), updated: a.updated || a.published });
}
ARTICLES.sort((x, y) => (y.featured ? 1 : 0) - (x.featured ? 1 : 0) || y.published.localeCompare(x.published));
const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));

fs.rmSync('articles', { recursive: true, force: true });
fs.mkdirSync('articles');

for (const a of ARTICLES) {
  const path = `articles/${a.slug}.html`;
  const toc = [...a.html.matchAll(/<h2 id="([\w-]+)">(?:<span class="n">\d+<\/span>)?(.*?)<\/h2>/g)].map(m => [m[1], m[2].replace(/<[^>]+>/g, '')]);
  const faq = a.faq || [];
  const related = (a.related || []).map(s => bySlug[s]).filter(Boolean);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, image: SITE + 'og.png', datePublished: a.published, dateModified: a.updated, author: ORG, publisher: ORG, mainEntityOfPage: SITE + path, articleSection: TOPICS[a.topic], wordCount: a.words },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Articles', item: SITE + 'articles/' },
      { '@type': 'ListItem', position: 2, name: a.title, item: SITE + path }] },
  ];
  if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans.replace(/<[^>]+>/g, '') } })) });
  const body = `<main class="post">
<p class="crumbs"><a href="/articles/">Articles</a> › <a href="/articles/#${a.topic}">${esc(TOPICS[a.topic])}</a></p>
<article>
<p class="eyebrow">${esc(TOPICS[a.topic])} · ${esc(a.kind || 'Guide')}</p>
<h1>${esc(a.title)}</h1>
<p class="lede">${a.lede}</p>
<div class="author"><i>Q</i><span><strong>QuizzifyTech team</strong><br><time datetime="${a.updated}">${a.updated === a.published ? 'Published' : 'Updated'} ${fmtDate(a.updated)}</time> · ${a.mins} min read</span></div>
${cover(a.topic, true)}
${toc.length >= 3 ? `<nav class="toc" aria-label="In this guide"><strong>In this guide</strong><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ol></nav>` : ''}
${a.html}
${faq.length ? `<h2 id="faq">Frequently asked questions</h2>\n${faq.map(([q, ans], i) => `<details class="faq"${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${ans}</p></details>`).join('\n')}` : ''}
</article>
<section class="more related"><h2>Keep reading</h2>
<ul class="buglist">${related.map(r => `<li><a href="/articles/${r.slug}.html">${esc(r.title)}</a><span>${esc(TOPICS[r.topic])} · ${r.mins} min</span></li>`).join('')}${(a.libraryLinks || []).map(([href, t, s]) => `<li><a href="${href}">${esc(t)}</a><span>${esc(s)}</span></li>`).join('')}</ul></section>
</main>`;
  fs.writeFileSync(path, page({ path, title: a.seoTitle || a.title, desc: a.description, type: 'article', ld, body,
    extraHead: `<meta property="article:published_time" content="${a.published}">\n<meta property="article:modified_time" content="${a.updated}">\n` }));
}

// Articles home
const [feat, ...rest] = ARTICLES;
const used = Object.keys(TOPICS).filter(t => ARTICLES.some(a => a.topic === t));
const meta = a => `QuizzifyTech team · ${a.mins} min read · ${fmtDate(a.updated)}`;
const idx = `<main>
<section class="hero">
<p class="eyebrow">Articles</p>
<h1>Learn to spot bugs faster</h1>
<p class="lede">Short, practical guides for testers and developers. Every article links to real bugs you can try to find yourself.</p>
</section>
<nav class="filters" aria-label="Topics"><a class="on" href="#all" data-t="all">All</a>${used.map(t => `<a href="#${t}" data-t="${t}">${esc(TOPICS[t])}</a>`).join('')}</nav>
<a class="featured" href="/articles/${feat.slug}.html" data-t="${feat.topic}">
${cover(feat.topic, true)}
<div>
<span class="kick">Featured · ${esc(TOPICS[feat.topic])}</span>
<h2>${esc(feat.title)}</h2>
<p>${esc(feat.description)}</p>
<span class="byline">${meta(feat)}</span>
</div>
</a>
<div class="grid">${rest.map(a => `<a class="card" href="/articles/${a.slug}.html" data-t="${a.topic}">${cover(a.topic)}<span class="kick">${esc(TOPICS[a.topic])}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><span class="byline">${a.mins} min read</span></a>`).join('\n')}</div>
<p class="byline" id="none" hidden>No articles on this topic yet. More are on the way.</p>
<section class="strip"><div><h2>Practise on real screens</h2><p>8 new bugs every day. Free, no sign-up.</p></div><a class="play" href="/">Play today’s quiz</a></section>
<section class="more"><h2>Looking for a specific bug?</h2><p>The <a href="/bugs/">Bug library</a> has ${ctx.PUZZLES.length} real-world bugs with steps to reproduce, expected and actual results, severity and a testing tip.</p></section>
</main>
<script>
// Topic filter. Without JavaScript every article stays visible.
(function () {
  var links = document.querySelectorAll('.filters a'), items = document.querySelectorAll('.featured, .card'), none = document.getElementById('none');
  function show(t) {
    if (!t || !document.querySelector('.filters a[data-t="' + t + '"]')) t = 'all';
    var n = 0;
    links.forEach(function (a) { a.classList.toggle('on', a.dataset.t === t); });
    items.forEach(function (el) { var on = t === 'all' || el.dataset.t === t; el.hidden = !on; if (on) n++; });
    none.hidden = n > 0;
  }
  links.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', a.dataset.t === 'all' ? location.pathname : '#' + a.dataset.t); show(a.dataset.t); }); });
  show(location.hash.slice(1));
})();
</script>`;
fs.writeFileSync('articles/index.html', page({ path: 'articles/', title: 'Software testing articles and guides', desc: 'Practical software testing guides for QA engineers and developers: common bugs, checklists, severity, interview prep and how to test APIs and checkouts.', wide: true, body: idx,
  ld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'QuizzifyTech articles', url: SITE + 'articles/', hasPart: ARTICLES.map(a => ({ '@type': 'Article', headline: a.title, url: SITE + 'articles/' + a.slug + '.html' })) }] }));

const n = writeSitemap();
console.log(`Built ${ARTICLES.length} articles (${ARTICLES.map(a => a.slug + ' ' + a.words + 'w').join(', ')}), articles/index.html and sitemap.xml (${n} URLs)`);
