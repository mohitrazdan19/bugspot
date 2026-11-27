export default {
  slug: 'bug-life-cycle',
  title: 'Bug life cycle (defect life cycle) explained with every status',
  seoTitle: 'Bug life cycle in software testing: every status explained',
  description: 'The defect life cycle from New to Closed: what each status means, who moves the bug, and how Rejected, Deferred, Duplicate and Reopened fit in.',
  topic: 'basics',
  kind: 'Explainer',
  published: '2026-11-26',
  lede: 'Every bug goes on a journey from the moment a tester finds it to the moment it is closed. This guide walks through each status, who owns it and the questions interviewers ask about it.',
  related: ['how-to-write-a-bug-report', 'bug-severity-vs-priority', 'error-defect-bug-failure'],
  libraryLinks: [['/bugs/', 'Real bugs to practise with', 'Bug library']],
  body: `
<p>The <strong>bug life cycle</strong>, also called the <strong>defect life cycle</strong>, is the set of statuses a bug moves through in a tracker such as Jira, from New to Closed. Knowing it helps you in two ways: at work you always know whose turn it is, and in interviews it is one of the most asked manual testing questions.</p>

<h2 id="flow">The main flow at a glance</h2>
<p>Most bugs follow this happy path:</p>
<p><strong>New → Assigned → Open → Fixed → Retest → Verified → Closed</strong></p>
<p>Some bugs leave the path: they are rejected, deferred, marked duplicate, or fail retest and go back as Reopened. Tools and companies use slightly different names (for example “In Progress” instead of Open, or “Ready for QA” instead of Retest), but the idea is the same.</p>

<h2 id="statuses">Every status, one by one</h2>
<div class="tbl"><table>
<thead><tr><th>Status</th><th>What it means</th><th>Who moves it</th></tr></thead>
<tbody>
<tr><td><strong>New</strong></td><td>The tester has logged the bug. Nobody has reviewed it yet.</td><td>Tester</td></tr>
<tr><td><strong>Assigned</strong></td><td>The lead or triage team has accepted it and given it to a developer.</td><td>Test lead, dev lead or product owner</td></tr>
<tr><td><strong>Open / In progress</strong></td><td>The developer is analysing and fixing it.</td><td>Developer</td></tr>
<tr><td><strong>Fixed</strong></td><td>The code change is done and merged.</td><td>Developer</td></tr>
<tr><td><strong>Retest / Ready for QA</strong></td><td>The fix is deployed to the test environment and waiting for the tester.</td><td>Developer or build team</td></tr>
<tr><td><strong>Verified</strong></td><td>The tester followed the steps again and the bug is gone.</td><td>Tester</td></tr>
<tr><td><strong>Closed</strong></td><td>Verified and no further work is needed. The bug’s life is over.</td><td>Tester or lead</td></tr>
<tr><td><strong>Reopened</strong></td><td>The bug is still there after the fix, or came back later.</td><td>Tester</td></tr>
</tbody></table></div>

<h2 id="side">The side paths: Rejected, Duplicate, Deferred, Not a bug</h2>
<ul>
<li><strong>Rejected / Not a bug:</strong> the developer or lead believes the behaviour is correct. Often this means the requirement was unclear. Do not argue in comments; point to the requirement, or ask the product owner to decide.</li>
<li><strong>Duplicate:</strong> the same bug is already logged. Link the two tickets and close the new one. Searching the tracker before you log a bug avoids this.</li>
<li><strong>Deferred / Postponed:</strong> it is a real bug, but it will be fixed in a later release. This is a priority decision, usually for low-impact bugs close to a release date.</li>
<li><strong>Cannot reproduce:</strong> the developer could not see the bug with the steps given. The fix is almost always a better bug report: exact data, environment, build number and a screen recording.</li>
</ul>
<p>A typo on the home page might be deferred in one team and fixed the same day in another. That is the difference between <a href="/articles/bug-severity-vs-priority.html">severity and priority</a>.</p>
{{bug:cta-typo}}

<h2 id="retest">Retesting a fix the right way</h2>
<p>When a bug comes back as Retest, do three things before you mark it Verified:</p>
<ol>
<li><strong>Repeat the exact steps</strong> from the report, with the same data.</li>
<li><strong>Try the nearby values.</strong> If the bug was a wrong discount on ₹1,200, also try ₹999 and ₹10,000. Fixes are often too narrow.</li>
<li><strong>Run a quick regression</strong> of the screens around the fix, because a fix in one place can break another.</li>
</ol>
<p>If any of these fail, move the bug to <strong>Reopened</strong> with a comment saying which build you tested and what you saw.</p>
{{bug:discount}}

{{try}}

<h2 id="reopened">Why bugs get reopened</h2>
<p>A high reopen count is a warning sign for a team. The common causes are:</p>
<ul>
<li>The fix covered one case but not the general rule (fixed for one coupon, not all coupons).</li>
<li>The fix was not deployed to the environment the tester was using.</li>
<li>The original report was vague, so the developer fixed a different problem.</li>
<li>Caching: the old value is still being served. Clear the cache or check the API directly.</li>
</ul>
{{bug:be-stale-cache}}

<h2 id="interview">Interview questions on the bug life cycle</h2>
<p><strong>Q: Explain the bug life cycle.</strong> Draw or list the main flow, New to Closed, then mention the side paths: Rejected, Duplicate, Deferred and Reopened. Say who owns each step.</p>
<p><strong>Q: What do you do if a developer rejects your bug?</strong> Re-check the requirement and reproduce it once more. If you still believe it is a bug, add evidence and ask the product owner or lead to decide. Stay factual and polite.</p>
<p><strong>Q: What is the difference between Deferred and Rejected?</strong> Deferred means it is a real bug that will be fixed later. Rejected means the team decided it is not a bug.</p>
<p><strong>Q: Can a tester close a bug?</strong> Yes, in most teams the tester closes the bug after verifying the fix. Some teams leave the final close to the lead.</p>
`,
  faq: [
    ['What is the bug life cycle in software testing?', 'It is the set of statuses a bug moves through, from New to Closed: New, Assigned, Open, Fixed, Retest, Verified and Closed, with side paths such as Rejected, Duplicate, Deferred and Reopened.'],
    ['Is the bug life cycle the same as the defect life cycle?', 'Yes. The two names are used for the same thing.'],
    ['When is a bug reopened?', 'When the tester retests the fix and the bug is still there, or when the same bug comes back in a later build.'],
    ['What is the difference between Deferred and Rejected?', 'Deferred means it is a real bug that will be fixed in a later release. Rejected means the team decided the behaviour is correct, so it is not a bug.'],
    ['Who closes a bug?', 'Usually the tester, after verifying the fix in the test environment. Some teams let the test lead do the final close.'],
  ],
};
