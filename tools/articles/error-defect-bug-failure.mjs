export default {
  slug: 'error-defect-bug-failure',
  title: 'Error vs defect vs bug vs failure: the difference in one example',
  seoTitle: 'Error vs defect vs bug vs failure in software testing (with example)',
  description: 'Error, fault, defect, bug and failure explained with one simple shopping cart example, plus a one-line answer for your QA interview.',
  topic: 'basics',
  kind: 'Explainer',
  published: '2026-11-26',
  lede: 'Error, defect, bug, fault and failure are often used as if they mean the same thing. In testing they describe different moments in the same story. One shopping cart example makes the difference stick.',
  related: ['bug-life-cycle', 'manual-testing-interview-questions', 'bug-severity-vs-priority'],
  libraryLinks: [['/bugs/', 'Real defects with expected and actual results', 'Bug library']],
  body: `
<p>This is usually the first question in any manual testing interview for freshers, and the answer is simpler than most textbooks make it. Let us follow one mistake from a developer’s keyboard to a customer’s phone.</p>

<h2 id="example">The example: 2 T-shirts for ₹500</h2>
<p>A shopping app sells a T-shirt for ₹500. A customer adds two to the cart. The total should be ₹1,000, but the app shows ₹500.</p>
<p>The rule behind every bug is the same: <strong>the expected result does not match the actual result.</strong> Expected ₹1,000, actual ₹500. Now let us name each stage.</p>

<h2 id="error">Error (or mistake): the human slip</h2>
<p><strong>An error is a mistake made by a person</strong>, usually a developer, but it can also be a business analyst writing the wrong requirement or a designer showing the wrong rule.</p>
<p>In our example, the developer meant to write <code>total = price × quantity</code> but wrote <code>total = price</code>. That slip in their head and on the keyboard is the error. Nobody has noticed it yet.</p>

<h2 id="fault">Fault: the wrong code that is now in the product</h2>
<p>Once the wrong line is saved in the code, the product contains a <strong>fault</strong>: something incorrect inside the software that can cause it to behave wrongly. The ISTQB glossary treats fault as another word for defect, so you will often hear them used together.</p>

<h2 id="defect">Defect and bug: found during testing</h2>
<p>A tester adds two T-shirts, does the maths and sees ₹500 instead of ₹1,000. They log a ticket: “Cart: total ignores quantity (₹500 instead of ₹1,000 for 2 × ₹500)”.</p>
<p><strong>A defect is the problem in the product that makes the actual result differ from the expected result.</strong> <strong>A bug is simply the everyday word for a defect.</strong> In daily work people say “I found a bug”; in reports and contracts people write “defect”. They mean the same thing.</p>
{{bug:fe-item-qty-sum}}
{{bug:cart-total}}

<h2 id="failure">Failure: what users actually see</h2>
<p>Suppose the tester missed it and the app went live. A real customer buys two T-shirts and pays only ₹500. The company loses ₹500 on every such order. <strong>A failure is when the defect runs in the real world and the system does something wrong that users or the business can see.</strong></p>
<p>Not every defect causes a failure. A defect in a screen nobody opens may never fail. That is why testers focus first on the paths real users take, such as checkout and payment.</p>
{{bug:failed-but-charged}}

{{try}}

<h2 id="summary">The difference in one table</h2>
<div class="tbl"><table>
<thead><tr><th>Term</th><th>What it is</th><th>Who causes or finds it</th><th>In our example</th></tr></thead>
<tbody>
<tr><td><strong>Error / mistake</strong></td><td>A human mistake</td><td>Developer, analyst, designer</td><td>Forgot to multiply by quantity</td></tr>
<tr><td><strong>Fault</strong></td><td>The wrong code or rule in the product</td><td>Left in the code</td><td><code>total = price</code></td></tr>
<tr><td><strong>Defect / bug</strong></td><td>Expected and actual do not match</td><td>Found by a tester</td><td>Ticket: total ₹500 instead of ₹1,000</td></tr>
<tr><td><strong>Failure</strong></td><td>The product does the wrong thing in use</td><td>Seen by users</td><td>Customers pay half price</td></tr>
</tbody></table></div>
<p>One-line memory trick: <strong>Error → Defect / Bug → Failure.</strong> Developer’s mistake, found in testing, seen by users.</p>

<h2 id="more">Two more words interviewers like</h2>
<ul>
<li><strong>Issue:</strong> a general word for anything logged in the tracker, including bugs, tasks and questions. Not every issue is a bug.</li>
<li><strong>Incident:</strong> something unexpected that happened, usually in production, that needs investigation. An incident may turn out to be a failure caused by a defect, or a problem with data, network or a third-party service.</li>
</ul>

<h2 id="interview">How to answer in an interview</h2>
<p>“An <strong>error</strong> is a human mistake, for example a developer forgetting to multiply price by quantity. That mistake leaves a <strong>fault</strong> or <strong>defect</strong> in the code. When a tester finds it, because the expected result does not match the actual result, we log it as a defect, which we usually call a <strong>bug</strong>. If it reaches users and the system behaves wrongly in real use, that is a <strong>failure</strong>.” Then add a real example, like the cart total. A concrete example is what interviewers remember.</p>
`,
  faq: [
    ['What is the difference between a bug and a defect?', 'There is no real difference. Defect is the formal word used in reports and standards, and bug is the everyday word. Both mean the actual result does not match the expected result.'],
    ['What is the difference between an error and a failure?', 'An error is a human mistake, usually while writing code or requirements. A failure is what happens when the resulting defect runs in real use and the system does something wrong that users can see.'],
    ['Does every defect cause a failure?', 'No. A defect causes a failure only when the faulty code actually runs with the conditions that trigger it. A defect on a screen nobody uses may never cause a failure.'],
    ['What is a fault in software testing?', 'A fault is the incorrect code or rule inside the product. The ISTQB glossary treats fault as a synonym for defect.'],
  ],
};
