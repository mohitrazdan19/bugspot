export default {
  slug: 'how-to-write-a-bug-report',
  title: 'How to write a bug report, with a real example and template',
  seoTitle: 'How to write a bug report: example, format and free template',
  description: 'A good bug report gets fixed fast. Learn the 9 parts of a bug report, see a full example and copy a free template you can use at work today.',
  topic: 'basics',
  kind: 'Guide',
  published: '2026-11-26',
  lede: 'A bug that nobody can reproduce does not get fixed. This guide shows the nine parts of a good bug report, a complete example and a template you can copy.',
  related: ['bug-severity-vs-priority', 'bug-life-cycle', 'manual-testing-interview-questions'],
  libraryLinks: [['/bugs/', 'Every bug in the Bug library is written as a full bug report', 'Bug library']],
  body: `
<p>Finding a bug is half the job. The other half is writing it down so clearly that a developer you have never met can see the same problem in two minutes, without sending you a single question. That is the whole test of a bug report: <strong>can someone else reproduce it from the report alone?</strong></p>
<p>Below are the parts every report needs, a full example written the way we would file it at work, and a template to copy.</p>

<h2 id="parts">The 9 parts of a bug report</h2>
<p>Bug trackers such as Jira, Azure DevOps and Bugzilla all name their fields a little differently, but every good report has these nine parts.</p>
<div class="tbl"><table>
<thead><tr><th>Part</th><th>What to write</th></tr></thead>
<tbody>
<tr><td><strong>1. Title</strong></td><td>What is wrong and where, in one line.</td></tr>
<tr><td><strong>2. Environment</strong></td><td>App version, build, device, OS, browser, test or staging server, test account.</td></tr>
<tr><td><strong>3. Preconditions</strong></td><td>What must be true before step 1, such as “user is signed in with 3 items in the cart”.</td></tr>
<tr><td><strong>4. Steps to reproduce</strong></td><td>Numbered, one action per step, with the exact data you typed.</td></tr>
<tr><td><strong>5. Expected result</strong></td><td>What should happen, ideally backed by the requirement or simple maths.</td></tr>
<tr><td><strong>6. Actual result</strong></td><td>What really happened, with the exact numbers and messages on screen.</td></tr>
<tr><td><strong>7. Severity and priority</strong></td><td>How bad it is, and your suggestion for how soon to fix it.</td></tr>
<tr><td><strong>8. Evidence</strong></td><td>Screenshot, screen recording, console log, API request and response.</td></tr>
<tr><td><strong>9. Notes</strong></td><td>How often it happens, what you already ruled out, related tickets.</td></tr>
</tbody></table></div>

<h2 id="title">Writing a title developers can act on</h2>
<p>The title is the part most people read, in the backlog, in triage and in release notes. A good title says <strong>what is wrong, where, and with which value</strong>. Compare:</p>
<ul>
<li>Bad: “Cart issue”</li>
<li>Bad: “Total is wrong!!!”</li>
<li>Good: “Cart: order total is ₹100 lower than items plus delivery”</li>
</ul>
<p>The good title tells the reader the screen, the symptom and the size of the problem before they open the ticket. Avoid words like “not working”, “issue” or “problem” on their own. They describe your feelings about the bug, not the bug.</p>
{{bug:cart-total}}

<h2 id="steps">Steps to reproduce that anyone can follow</h2>
<p>Write the steps for someone who has never opened the app. Three rules cover most of it:</p>
<ol>
<li><strong>One action per step.</strong> “Open the cart and change quantity and apply coupon” is three steps.</li>
<li><strong>Give exact data.</strong> Not “enter a wrong value” but “enter 250 in Age”. The developer should be able to copy your input.</li>
<li><strong>Start from a known place.</strong> Begin from the home screen or a URL, and put anything that must already be set up in Preconditions.</li>
</ol>
<p>Before you submit, follow your own steps once more from the start. You will often find a step you skipped in your head, such as “select delivery slot”.</p>

<h2 id="expected-actual">Expected vs actual result</h2>
<p>This pair is the heart of the report. The expected result should not be your opinion. Point to something the team agreed on: the requirement, the design, the maths or the way the rest of the product behaves. The actual result should be exact, word for word and digit for digit.</p>
<ul>
<li>Weak: “Expected: correct GST. Actual: GST is wrong.”</li>
<li>Strong: “Expected: 18% GST on ₹1,500 is ₹270. Actual: GST line shows ₹207, and the total is ₹1,707 instead of ₹1,770.”</li>
</ul>
{{bug:gst-wrong}}

<h2 id="example">A complete bug report example</h2>
<p>Here is a full report for a real bug from our Bug library, written the way you would file it in Jira.</p>
<div class="tbl"><table><tbody>
<tr><td><strong>Title</strong></td><td>Checkout: “You pay” is ₹1,080 for a 15% discount on ₹1,200 (should be ₹1,020)</td></tr>
<tr><td><strong>Environment</strong></td><td>Android app 4.12.0 (build 412), Pixel 7, Android 14, staging server, test user tester01</td></tr>
<tr><td><strong>Preconditions</strong></td><td>Signed in. Cart has one item priced ₹1,200. Coupon SAVE15 is active.</td></tr>
<tr><td><strong>Steps</strong></td><td>1. Open Cart.<br>2. Tap “Apply coupon”.<br>3. Enter SAVE15 and tap Apply.<br>4. Read the price summary.</td></tr>
<tr><td><strong>Expected</strong></td><td>Discount line shows ₹180 (15% of ₹1,200) and “You pay” shows ₹1,020.</td></tr>
<tr><td><strong>Actual</strong></td><td>Discount line shows 15% but “You pay” shows ₹1,080, which is a 10% discount.</td></tr>
<tr><td><strong>Severity</strong></td><td>P2 · Major. The customer is overcharged ₹60 on every order with this coupon.</td></tr>
<tr><td><strong>Priority</strong></td><td>Suggested High: the coupon is in this weekend’s campaign.</td></tr>
<tr><td><strong>Evidence</strong></td><td>Screenshot of the summary, network response of /cart/price.</td></tr>
<tr><td><strong>Notes</strong></td><td>Happens every time (5 of 5). Also on web. Other coupons (FLAT100) are correct.</td></tr>
</tbody></table></div>
{{bug:discount}}
<p>Notice the small details that save time: the build number, the test account, “5 of 5”, and the line saying what was already ruled out. A developer can start fixing this without asking anything.</p>

{{try}}

<h2 id="template">Bug report template you can copy</h2>
<pre class="http tpl"><code>Title: [Screen]: [what is wrong] ([value seen] instead of [value expected])

Environment: App/site version, build, device, OS, browser, server, test account
Preconditions: What must be set up before step 1

Steps to reproduce:
1.
2.
3.

Expected result:
Actual result:

Severity: P1 Critical / P2 Major / P3 Minor / P4 Cosmetic, and one line why
Priority (suggested):
Frequency: e.g. 5 of 5 tries
Evidence: screenshot, video, logs, API request and response
Notes: what you ruled out, related tickets</code></pre>

<h2 id="mistakes">Common bug report mistakes</h2>
<ul>
<li><strong>Two bugs in one report.</strong> One ticket, one problem. If the total is wrong and the button is misaligned, file two reports so each can be fixed and closed on its own.</li>
<li><strong>No version or environment.</strong> “It works on my machine” starts here. Always say where you saw it.</li>
<li><strong>Blaming people.</strong> Write about the product, never the developer. “The total is wrong”, not “someone broke the total again”.</li>
<li><strong>Guessing the cause as fact.</strong> You may add “possibly rounding at the discount step”, but label it as a guess.</li>
<li><strong>Screenshots without context.</strong> Circle the wrong value. A full-page screenshot with no mark makes the reader hunt.</li>
<li><strong>Judging severity by how it looks.</strong> Some of the worst bugs are invisible, like a password in the logs.</li>
</ul>
{{bug:be-log-card}}

<h2 id="practise">How to get better at it</h2>
<p>Writing reports is a skill, and it improves with repetition. Every bug in our <a href="/bugs/">Bug library</a> is written as a full report with title, steps, expected and actual result, severity and a testing tip, so you can compare your wording with ours. Find a bug in today’s quiz, write your own report for it, then open its library page and compare.</p>
`,
  faq: [
    ['What should a bug report contain?', 'A clear title, the environment, preconditions, numbered steps to reproduce, expected result, actual result, severity and priority, evidence such as screenshots or logs, and notes such as how often it happens.'],
    ['What is the most important part of a bug report?', 'The steps to reproduce, together with the expected and actual results. If a developer cannot reproduce the bug from the report alone, it is unlikely to be fixed quickly.'],
    ['How do you write a good bug title?', 'Say what is wrong, where it happens and the value you saw, in one line. For example: “Cart: order total is ₹100 lower than items plus delivery”. Avoid vague words like “issue” or “not working”.'],
    ['Should a tester set priority in a bug report?', 'A tester usually sets severity and can suggest a priority. The final priority is normally decided by the product owner or team lead, who knows the release plan.'],
    ['Which tools are used to write bug reports?', 'Jira is the most common in Indian IT companies, followed by Azure DevOps, Bugzilla, Mantis, YouTrack and GitHub Issues. The fields differ a little, but the parts of a good report are the same.'],
  ],
};
