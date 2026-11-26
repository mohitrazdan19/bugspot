# Articles

Each file here is one article on https://quizzifytech.com/articles/.
After adding or editing one, run from the repo root:

    node tools/build-articles.mjs
    node tools/build-bugs.mjs

The first rebuilds the articles, the second adds a “Learn more in our guides” link on every Bug library page that an article uses.

That rebuilds `articles/` (the index and every article page) and `sitemap.xml`.
Never edit the files in `articles/` by hand; they are overwritten.

Fields: `slug` (file name of the page), `title`, `seoTitle` (optional, for the browser tab and Google),
`description` (under 155 characters), `topic` (frontend, api, backend, database, ai or basics),
`kind` (Guide, Checklist, Explainer...), `published` and optional `updated` (YYYY-MM-DD),
`featured: true` to show it first, `draft: true` to keep it off the site, `lede`, `body` (HTML), `faq` ([question, answer] pairs, shown as
FAQs and sent to Google as FAQ data), `related` (other article slugs) and `libraryLinks`.

In `body`, `<h2 id="...">` headings make the table of contents, `{{bug:<puzzle id>}}` adds a
"Real example" card for a Bug library puzzle, and `{{try}}` adds the "Play today's quiz" banner.
