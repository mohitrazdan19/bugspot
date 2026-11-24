export default {
  slug: 'bug-severity-vs-priority',
  title: 'Bug severity vs priority, explained with real examples',
  seoTitle: 'Bug severity vs priority: the difference, with real examples',
  description: 'Severity is how bad a bug is. Priority is how soon to fix it. Learn the four severity levels and the four tricky combinations, with real bug examples.',
  topic: 'basics',
  kind: 'Explainer',
  published: '2026-11-24',
  draft: true, // held back by Mohit 24 Nov; remove this line to publish (and set published to that day)
  lede: 'Severity is how bad a bug is. Priority is how soon it should be fixed. They often match, but the interesting bugs are the ones where they do not.',
  related: ['common-api-bugs', 'checkout-bugs'],
  libraryLinks: [['/bugs/', 'Every bug in the Bug library, with its severity', 'Bug library']],
  body: `
<p>“What is the difference between severity and priority?” is one of the most common QA interview questions, and one of the most common arguments in bug triage meetings. The short answer fits in one line. The useful answer needs examples, so this guide uses real bugs from our Bug library.</p>

<h2 id="severity">What severity means</h2>
<p><strong>Severity is the impact of a bug on the user or the business.</strong> It answers the question: if this bug happens, how bad is it? The tester who finds the bug usually sets the severity, because they know best what it does. Severity does not change much over time. A bug that loses money is serious today and serious next month.</p>
<p>Most teams use four levels. On QuizzifyTech we write them as P1 to P4:</p>
<div class="tbl"><table>
<thead><tr><th>Level</th><th>What it means</th><th>Real example</th></tr></thead>
<tbody>
<tr><td><strong>P1 · Critical</strong></td><td>Loses money, exposes private data or blocks a key task.</td><td><a href="/bugs/cart-total.html">Order total is ₹100 lower than the items plus delivery</a></td></tr>
<tr><td><strong>P2 · Major</strong></td><td>The feature partly works, but users get wrong information or a broken step.</td><td><a href="/bugs/keyboard.html">On-screen keyboard hides the Pay button</a></td></tr>
<tr><td><strong>P3 · Minor</strong></td><td>Nobody is blocked, but it looks careless and costs trust.</td><td><a href="/bugs/pagination.html">Result range reads “21–20 of 45”</a></td></tr>
<tr><td><strong>P4 · Cosmetic</strong></td><td>A small visual or wording slip.</td><td><a href="/bugs/plural-msg.html">“1 new messages” instead of “1 new message”</a></td></tr>
</tbody></table></div>
<p>A note on names: some companies write severity as S1 to S4 and keep P1 to P4 for priority, others use words such as Blocker, Critical, Major, Minor and Trivial. The labels matter less than agreeing on them as a team. Whatever you use, write it down once in your bug report template.</p>

<h2 id="priority">What priority means</h2>
<p><strong>Priority is the order in which bugs get fixed.</strong> It answers the question: given everything else the team has to do, how soon should this be fixed? Priority is usually set by the product owner or the team lead, because it depends on things a tester may not know: the release date, which customers are affected, marketing plans and how much the fix costs.</p>
<p>Priority changes over time. A bug in a feature that launches next week can jump to the top of the list on Monday.</p>

<h2 id="combinations">The four combinations</h2>
<p>Most bugs are either serious and urgent, or minor and not urgent, and nobody argues about those. The two mixed cases are where severity and priority really differ, and they are what interviewers want to hear about.</p>

<h3>High severity, high priority</h3>
<p>The easy case. Customers are being charged the wrong amount or seeing someone else’s data. Stop the release, fix it now.</p>
{{bug:failed-but-charged}}

<h3>Low severity, high priority</h3>
<p>The classic interview example is a typo, and it is a real one. A spelling mistake does not stop anyone from using the product, so its severity is cosmetic. But if the typo is on the main button of the sign-in screen, or in the company’s name on the home page, every visitor sees it on launch day. That makes it a quick, cheap fix that should happen today.</p>
{{bug:cta-typo}}

<h3>High severity, low priority</h3>
<p>A bug can be serious and still wait. Imagine a crash that only happens on an old app version used by a handful of people, in a feature that is being removed next sprint. The impact on those users is severe, but the team may decide to fix it by removing the feature rather than by patching it now. Another common case is a serious bug behind a feature flag that no customer can reach yet.</p>
<p>Be careful with this one. “High severity, low priority” should be a conscious decision with a reason written in the ticket, not a way to forget about a real problem.</p>

<h3>Low severity, low priority</h3>
<p>Small slips on screens few people visit. They still deserve a ticket, because many small slips add up to a product that feels unfinished. They are good work for a quiet afternoon or a new team member.</p>
{{bug:lorem}}

{{try}}

<h2 id="how-to-set">How to set severity in a bug report</h2>
<p>Ask three questions, in this order:</p>
<ol>
<li><strong>Can it lose money, leak data or break the law?</strong> Then it is critical, even if it looks small on screen. A wrong tax amount is a one-digit slip and still a P1.</li>
<li><strong>Does it stop or mislead the user in a main task?</strong> Wrong information, a broken step or a workaround nobody would find: major.</li>
<li><strong>Is it only about how the product looks or reads?</strong> Minor if it costs trust, cosmetic if it is a small visual or wording slip.</li>
</ol>
{{bug:gst-wrong}}
<p>Then write one sentence that explains your choice, such as “P1 because every invoice over ₹1,000 shows the wrong GST”. That sentence saves a long discussion in triage, and it helps the product owner set a sensible priority.</p>

<h2 id="mistakes">Common mistakes</h2>
<ul>
<li><strong>Marking everything critical.</strong> If every bug is P1, nothing is. Save the top level for bugs that really lose money, data or a key task.</li>
<li><strong>Judging by how hard the fix is.</strong> Severity is about impact, not effort. A one-line fix can be a P1.</li>
<li><strong>Judging by how it looks.</strong> Some of the worst bugs are invisible on screen: a password in the logs, a backup that is empty, a token that never expires.</li>
<li><strong>Setting priority without the business context.</strong> Testers can suggest a priority, but the final call belongs to whoever plans the work.</li>
</ul>

<h2 id="interview">How to answer this in an interview</h2>
<p>Keep it short and give examples: “Severity is how much damage a bug does, and the tester sets it. Priority is how soon we fix it, and the product owner sets it based on the business. They usually go together, but not always. A typo on the home page is low severity but high priority. A crash in a feature nobody can reach yet can be high severity but lower priority.” Then offer one example from your own work. Interviewers remember a real story far better than a definition.</p>
`,
  faq: [
    ['Who decides the severity of a bug?', 'Usually the tester who reports it, because they understand the impact best. The team can adjust it during triage.'],
    ['Who decides the priority of a bug?', 'Usually the product owner, project manager or team lead, because priority depends on release plans, customers and cost.'],
    ['Can a bug have low severity and high priority?', 'Yes. A spelling mistake on the main sign-in button or in the company name is cosmetic, but every visitor sees it, so it should be fixed straight away.'],
    ['Can a bug have high severity and low priority?', 'Yes, for example a crash in an old app version that almost nobody uses, or a serious bug in a feature that is not released yet. The reason for waiting should be written in the ticket.'],
    ['Is P1 severity or priority?', 'It depends on the team. Some teams use P1 to P4 for priority and S1 to S4 for severity. On QuizzifyTech, P1 to P4 describe severity. Agree on one meaning in your team and write it in your bug template.'],
  ],
};
