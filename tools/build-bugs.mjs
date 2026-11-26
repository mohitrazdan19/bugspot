// Builds the Bug library: bugs/index.html plus one readable page per puzzle, and refreshes sitemap.xml.
// Run from the repo root after adding or editing puzzles:  node tools/build-bugs.mjs
// No packages needed. It reads the PUZZLES data straight out of index.html.
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
const PUZZLES = ctx.PUZZLES;

// Published articles that use a bug ({{bug:id}} card or a /bugs/<id>.html link), so each bug page can link back to them.
const GUIDES = {};
for (const f of fs.readdirSync('tools/articles').filter(f => f.endsWith('.mjs')).sort()) {
  const a = (await import('./articles/' + f)).default;
  if (a.draft) continue;
  const ids = new Set([...a.body.matchAll(/\{\{bug:([\w-]+)\}\}|\/bugs\/([\w-]+)\.html/g)].map(m => m[1] || m[2]));
  ids.forEach(id => (GUIDES[id] = GUIDES[id] || []).push(a));
}

const TRACKS = ['Frontend', 'Backend', 'API', 'Database', 'AI'];
const TRACK_LABEL = { AI: 'AI testing' };
const DIFF = { Easy: 'Beginner', Medium: 'Intermediate', Hard: 'Experienced' };
const SEV = { P1: 'Critical', P2: 'Major', P3: 'Minor', P4: 'Cosmetic' };
const trk = p => p.track || 'Frontend';
const tl = t => TRACK_LABEL[t] || t + ' testing';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SEV_WHY = {
  P1: 'This is a critical (P1) bug. It can lose money, expose private data or stop people from finishing a key task. A bug like this should block a release and be fixed straight away.',
  P2: 'This is a major (P2) bug. The feature still works in part, but users get wrong information or a broken step, and many will notice. It should be fixed before or soon after release.',
  P3: 'This is a minor (P3) bug. It does not stop anyone, but it looks careless and makes people trust the product less. It is usually fixed in a normal sprint.',
  P4: 'This is a cosmetic (P4) bug. It is a small visual or wording problem. It is cheap to fix and worth reporting, because many small slips add up to a product that feels unfinished.',
};
const TRACK_INTRO = {
  Frontend: 'Frontend bugs are the ones users see on the screen: wrong totals, labels that do not match, broken layouts, dates that cannot be right and buttons that say the wrong thing.',
  Backend: 'Backend bugs hide behind a screen that looks fine: jobs that run twice, retries that never stop, stale caches, reports that say success when nothing happened.',
  API: 'API bugs live in the JSON between the app and the server: wrong records returned, fields that leak private data, bad status codes and limits that are not enforced.',
  Database: 'Database bugs show up when you look at the tables: duplicate rows, joins that double totals, deleted users still active, values cut short or saved in the wrong type.',
  AI: 'AI testing bugs come from chatbots and AI features: made-up facts, answers that change, prompt injection, leaked instructions and bias in what the model says.',
};
const TRACK_CHECK = {
  Frontend: ['Add up every total and compare numbers that should match.', 'Read every label, plural and date out loud.', 'Try the smallest and largest values a field allows.', 'Check the screen on a small phone and with long text.'],
  Backend: ['Check that each action happens exactly once.', 'Look at logs, outboxes and job history, not just the screen.', 'Test what happens on a slow network, a retry and a double click.', 'Compare cached values with the source of truth.'],
  API: ['Read the whole response body, not only the status code.', 'Ask for other users’ records on purpose.', 'Look for fields that should never leave the server.', 'Send values at and past every limit.'],
  Database: ['Run the query yourself and count the rows.', 'Look for duplicates that differ only in case or spaces.', 'Check deleted and archived records.', 'Compare stored values with what the user typed.'],
  AI: ['Ask the same question several times and in different words.', 'Hide instructions inside documents and inputs.', 'Ask about data the user should not see.', 'Check every fact, number and source the AI gives.'],
};

const FAV = '<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96"><link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png">';
// The AdSense tags in index.html's <head> are copied to every generated page.
const adsStart = src.indexOf('<meta name="google-adsense-account"');
const ADS = adsStart < 0 ? '' : src.slice(adsStart, src.indexOf('</script>', adsStart) + '</script>'.length);
const LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 8.2c-2.6 0-4.4 1.9-4.4 4.6S9.4 19 12 19s4.4-3.6 4.4-6.2S14.6 8.2 12 8.2Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M12 8.2V19M9.3 6.4a2.7 2.7 0 0 1 5.4 0M7.6 12.3 4 10.6M16.4 12.3 20 10.6M8 16.4l-3.4 1.6M16 16.4l3.4 1.6"/></svg>';
const FOOT = `<footer class="site">
  <nav aria-label="Site"><a href="/">Play</a><a href="/articles/">Articles</a><a href="/bugs/">Bug library</a><a href="/about.html">About</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms</a><a href="/contact.html">Contact</a></nav>
  <p>© 2026 QuizzifyTech. Free daily tech quizzes for testers and developers.</p>
</footer>`;

function page(path, title, desc, body, ld) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | QuizzifyTech</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${esc(title)} | QuizzifyTech">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}og.png">
${FAV}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/pages.css">
${ld ? '<script type="application/ld+json">' + JSON.stringify(ld) + '</script>\n' : ''}<script src="/gtm.js"></script>
${ADS}
</head>
<body>
<div class="bg" aria-hidden="true"><i></i><i></i></div>
<div class="wrap">
<header class="top"><a class="brand" href="/">${LOGO}QuizzifyTech</a><nav class="topnav"><a class="lnk lib" href="/bugs/">Bug library</a><a class="lnk" href="/articles/">Articles</a><a class="play" href="/">Play<span class="long"> today’s quiz</span></a></nav></header>
<main>
${body.trim()}
</main>
${FOOT}
</div>
<script src="/notice.js" defer></script>
</body>
</html>
`;
}

fs.rmSync('bugs', { recursive: true, force: true });
fs.mkdirSync('bugs');

const byTrack = {};
TRACKS.forEach(t => { byTrack[t] = PUZZLES.filter(p => trk(p) === t); });

PUZZLES.forEach(p => {
  const r = p.rep, t = trk(p), list = byTrack[t], i = list.indexOf(p);
  const related = [1, 2, 3].map(k => list[(i + k) % list.length]).filter(x => x !== p);
  const desc = `${tl(t)} bug: ${r.title}. Expected ${r.expected}; actual ${r.actual}. Steps to reproduce, why it matters and a testing tip.`.slice(0, 300);
  const body = `
<p class="crumbs"><a href="/bugs/">Bug library</a> › <a href="/bugs/#${t.toLowerCase()}">${esc(tl(t))}</a></p>
<article>
<p class="eyebrow">${esc(tl(t))} · ${esc(p.area)}</p>
<h1>${esc(r.title)}</h1>
<p class="chips"><span class="chip sev-${p.sev}">${p.sev} · ${SEV[p.sev] || ''}</span><span class="chip">${DIFF[p.diff] || p.diff}</span><span class="chip">${esc(p.area)}</span></p>

<div class="note try"><p><strong>Want to find it yourself first?</strong> This page gives away the answer. Play this bug on a fake app screen and see if you can spot it in three tries.</p><p><a class="play" href="/?p=${encodeURIComponent(p.id)}">Spot this bug</a></p></div>

<h2>The clue</h2>
<p>${esc(p.hint)}</p>

<h2>Steps to reproduce</h2>
<ol>${r.steps.map(s => '<li>' + esc(s) + '</li>').join('')}</ol>

<h2>Expected result</h2>
<p>${esc(r.expected)}</p>

<h2>Actual result</h2>
<p>${esc(r.actual)}</p>

<h2>Why it matters</h2>
<p>${SEV_WHY[p.sev] || ''}</p>

<h2>Testing tip</h2>
<p>${esc(r.tip)}</p>

<h2>How to find bugs like this</h2>
<p>${TRACK_INTRO[t]} When you test, try these checks:</p>
<ul>${TRACK_CHECK[t].map(s => '<li>' + s + '</li>').join('')}</ul>
</article>

${(GUIDES[p.id] || []).length ? `<section class="more">
<h2>Learn more in our guides</h2>
<ul class="buglist">${GUIDES[p.id].map(a => `<li><a href="/articles/${a.slug}.html">${esc(a.title)}</a><span>Article</span></li>`).join('')}</ul>
</section>
` : ''}<section class="more">
<h2>More ${esc(tl(t))} bugs</h2>
<ul class="buglist">${related.map(x => `<li><a href="/bugs/${x.id}.html">${esc(x.rep.title)}</a><span>${x.sev} · ${DIFF[x.diff]}</span></li>`).join('')}</ul>
<p><a href="/bugs/">See all ${PUZZLES.length} bugs</a></p>
</section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: r.title, description: desc, url: SITE + 'bugs/' + p.id + '.html', about: tl(t), isPartOf: { '@type': 'WebSite', name: 'QuizzifyTech', url: SITE } };
  fs.writeFileSync(`bugs/${p.id}.html`, page(`bugs/${p.id}.html`, r.title, desc, body, ld));
});

const idx = `
<article>
<h1>Bug library</h1>
<p class="meta">${PUZZLES.length} real-world software bugs, explained</p>
<p>Every puzzle on QuizzifyTech is based on a kind of bug that happens in real products. This library lists all of them with a full bug report: steps to reproduce, the expected and actual result, how serious it is and a tip you can use when you test. Use it to prepare for QA interviews, to learn what to look for in a new area, or to pick bugs to discuss with your team.</p>
<p>Each page gives away the answer, so if you want a challenge, tap <strong>Spot this bug</strong> on the page and try to find it first. New bugs arrive in <a href="/">Today’s Quiz</a> every day.</p>
<h2>Severity in one line</h2>
<ul>
  <li><strong>P1 Critical:</strong> loses money, leaks data or blocks a key task.</li>
  <li><strong>P2 Major:</strong> wrong information or a broken step many users will hit.</li>
  <li><strong>P3 Minor:</strong> does not stop anyone, but hurts trust.</li>
  <li><strong>P4 Cosmetic:</strong> a small visual or wording slip.</li>
</ul>
<p class="jump">${TRACKS.map(t => `<a href="#${t.toLowerCase()}">${esc(tl(t))} (${byTrack[t].length})</a>`).join('')}</p>
</article>
${TRACKS.map(t => `
<section class="more" id="${t.toLowerCase()}">
<h2>${esc(tl(t))}</h2>
<p>${TRACK_INTRO[t]}</p>
${['Easy', 'Medium', 'Hard'].map(d => { const l = byTrack[t].filter(p => p.diff === d); return l.length ? `<h3>${DIFF[d]}</h3>
<ul class="buglist">${l.map(x => `<li><a href="/bugs/${x.id}.html">${esc(x.rep.title)}</a><span>${x.sev} · ${esc(x.area)}</span></li>`).join('')}</ul>` : ''; }).join('\n')}
</section>`).join('\n')}`;
fs.writeFileSync('bugs/index.html', page('bugs/', 'Bug library: ' + PUZZLES.length + ' software bugs explained', `${PUZZLES.length} real-world software bugs for testers, with steps to reproduce, expected vs actual results, severity and testing tips. Frontend, backend, API, database and AI testing.`, idx));

writeSitemap(PUZZLES.map(p => p.id));
console.log('Built', PUZZLES.length, 'bug pages, bugs/index.html and sitemap.xml');
