# QuizzifyTech

The site at https://quizzifytech.com (the repo name stays `bugspot`). A daily spot-the-bug game for QA testers. One file, `index.html`, hosted on GitHub Pages.

## No sign-in on the public site

Everyone plays all 8 daily bugs and every practice level free, with no sign-up. The public game has no sign-in and never asks for an email (removed in Nov 2026, including team invite links `?join=` and the `?signin` manager link). The admin page keeps its own sign-in. The old sign-in and teams code is in git history if it is ever needed again; `supabase/schema.sql` and `supabase/teams.sql` still describe those tables.

## Usage stats and admin page

The game sends anonymous events (visit, puzzle start/found/missed, share) with a random per-browser id. No IP address, email or other personal data is stored.

- Tables and functions: `supabase/analytics.sql` (already applied to the project).
- Admin page: `admin.html` (private, signed-in owner only). Admins are the emails listed in the `admins` table.
- To add another admin: `insert into public.admins (email) values ('name@example.com');`

## Search and link previews

- `og.png` is the preview image shown when the link is shared on LinkedIn, WhatsApp, X and others. If the site moves to a new domain, update the URLs in the `og:` and `twitter:` tags, `canonical`, and `sitemap.xml`.
- `sitemap.xml` lists the game page. Submit it in Google Search Console (add the site as a URL-prefix property). A `robots.txt` only works at the root of a domain, so add one after moving to a custom domain.
- New visitors (nothing saved in the browser) start straight on puzzle 1. Their `visit` event carries `{ "first": 1 }`.

## Google AdSense

- Pages AdSense looks for: `about.html`, `privacy.html`, `terms.html`, `contact.html` (shared look in `pages.css`). Every page has footer links to them.
- `notice.js` shows a one-time privacy notice at the bottom of each page. The legal consent for EEA, UK and Swiss visitors comes from Google's own consent message (AdSense, Privacy & messaging), which loads with the AdSense script.
- Ads are **off**. Each page's `<head>` has a commented-out block marked `ADSENSE`. To switch on: put the publisher ID (`ca-pub-...`) in both lines and remove the comment's first and last line, in `index.html`, `about.html`, `privacy.html`, `terms.html` and `contact.html`.
- `ads.txt` is a placeholder. After approval, replace its last line with the line AdSense shows under Sites (remove the `# `).
- Contact email on the pages is `hello@quizzifytech.com`. That mailbox must exist (Titan email on the domain).
- `robots.txt` points to `sitemap.xml` and keeps `admin.html` out of search.

## Bug library (readable pages for search and AdSense)

- `bugs/index.html` lists every puzzle by track and level; `bugs/<puzzle id>.html` is one page per bug (clue, steps, expected vs actual, why it matters, testing tip, related bugs). Linked from the footer, the About box and the About page.
- These pages are **generated**. After adding or editing puzzles, run `node tools/build-bugs.mjs` from the repo root (no packages needed). It rebuilds `bugs/` and `sitemap.xml`.
- Each bug page has a "Spot this bug" button linking to `/?p=<puzzle id>`, which opens that puzzle in Practice.

## Google Tag Manager and Google Analytics 4

- `gtm.js` loads on every page before the AdSense block. It sets Google consent mode (denied by default in the EEA, UK and Switzerland until Google's consent message is answered, granted elsewhere) and loads GTM only on quizzifytech.com, never for bots or local copies.
- GTM is **off** until an ID is set: put the container ID (`GTM-...`) in `var QT_GTM_ID = ''` at the top of `gtm.js`.
- The game pushes `puzzle_start`, `puzzle_found`, `puzzle_fail`, `share` and `track_pick` to `dataLayer`, with `puzzle_id`, `mode`, `tries` and `track` where they apply. Supabase stats are unchanged.
- `tools/gtm-container.json` can be imported into GTM (Admin, Import container, Merge). It adds a GA4 Google tag on all pages, one GA4 event tag for the game events, and a `GA4 Measurement ID` variable to set to your `G-...` ID.
