export default {
  slug: 'how-to-write-a-test-case',
  title: 'How to write a test case, with format and examples',
  seoTitle: 'How to write test cases: format, examples and template',
  description: 'Learn how to write test cases step by step: the standard format, a worked example for a cart, good vs bad test cases and a template to copy.',
  topic: 'basics',
  kind: 'Guide',
  published: '2026-11-26',
  lede: 'A test case is a small, repeatable experiment: do these steps with this data, and expect this result. Here is the standard format, a worked example and the habits that make test cases useful.',
  related: ['test-cases-for-login-page', 'how-to-write-a-bug-report', 'manual-testing-interview-questions'],
  libraryLinks: [['/bugs/#frontend', 'Frontend bugs to turn into test cases', 'Bug library']],
  body: `
<p>Many new testers think test cases are paperwork. They are not. A good test case is what lets anyone on the team, on any day, check the same thing the same way and get a clear pass or fail. It is also how you prove what was tested when a bug reaches production.</p>

<h2 id="what">What is a test case?</h2>
<p><strong>A test case is a set of steps, test data and an expected result that checks one specific thing in the product.</strong> If the actual result matches the expected result, the test passes. If not, you have found a bug and you write a bug report.</p>
<p>Three related words get mixed up in interviews:</p>
<ul>
<li><strong>Test scenario:</strong> what to test, in one line. “Check that the cart total is correct.”</li>
<li><strong>Test case:</strong> how to test it, with steps, data and an expected result. One scenario usually has several test cases.</li>
<li><strong>Test script:</strong> an automated version of a test case, written in code (Selenium, Playwright, Cypress and so on).</li>
</ul>

<h2 id="format">The standard test case format</h2>
<p>Teams use Excel, Google Sheets, TestRail, Zephyr or Xray, but the columns are almost always these:</p>
<div class="tbl"><table>
<thead><tr><th>Field</th><th>What to write</th></tr></thead>
<tbody>
<tr><td><strong>Test case ID</strong></td><td>A unique ID such as TC_CART_001</td></tr>
<tr><td><strong>Title</strong></td><td>What this case checks, in one line</td></tr>
<tr><td><strong>Module / requirement</strong></td><td>The feature or user story it covers, for traceability</td></tr>
<tr><td><strong>Preconditions</strong></td><td>What must be true before step 1</td></tr>
<tr><td><strong>Test data</strong></td><td>The exact values to use</td></tr>
<tr><td><strong>Steps</strong></td><td>Numbered actions, one per step</td></tr>
<tr><td><strong>Expected result</strong></td><td>What should happen, stated so that pass or fail is obvious</td></tr>
<tr><td><strong>Actual result</strong></td><td>Filled in during execution</td></tr>
<tr><td><strong>Status</strong></td><td>Pass, Fail, Blocked or Not run</td></tr>
<tr><td><strong>Priority</strong></td><td>High, Medium or Low, so the most important cases run first</td></tr>
</tbody></table></div>

<h2 id="example">A worked example: the cart total</h2>
<p>Requirement: “The order total is the sum of all items, plus delivery, minus discounts.” Here is one test case for it.</p>
<div class="tbl"><table><tbody>
<tr><td><strong>ID</strong></td><td>TC_CART_004</td></tr>
<tr><td><strong>Title</strong></td><td>Order total equals items plus delivery</td></tr>
<tr><td><strong>Preconditions</strong></td><td>User signed in, cart empty, delivery fee for this pin code is ₹40</td></tr>
<tr><td><strong>Test data</strong></td><td>Item A ₹525 × 1, Item B ₹300 × 2</td></tr>
<tr><td><strong>Steps</strong></td><td>1. Add Item A with quantity 1.<br>2. Add Item B with quantity 2.<br>3. Open the cart.<br>4. Read the price summary.</td></tr>
<tr><td><strong>Expected</strong></td><td>Items ₹1,125, Delivery ₹40, Total ₹1,165</td></tr>
<tr><td><strong>Priority</strong></td><td>High</td></tr>
</tbody></table></div>
<p>Notice that the expected result is a number you worked out yourself, not “the total is correct”. That is what turns a vague check into a real test. This exact case catches the bug below:</p>
{{bug:cart-total}}

<h2 id="design">Where test cases come from</h2>
<p>You do not have to invent test cases from nothing. Four simple techniques produce most of them:</p>
<ul>
<li><strong>Equivalence partitioning:</strong> split inputs into groups that should behave the same, and test one value from each. For an age field that accepts 18 to 60: one value below 18, one between, one above.</li>
<li><strong>Boundary value analysis:</strong> bugs live at the edges, so test 17, 18, 60 and 61, not just 30.</li>
<li><strong>Decision tables:</strong> list combinations of conditions, such as coupon valid or expired and cart above or below ₹499, and write a case for each row.</li>
<li><strong>Error guessing:</strong> use experience. Negative quantity, 31 February, a leap year, an emoji in a name, a double click on Pay.</li>
</ul>
{{bug:age-250}}
{{bug:neg-qty}}

{{try}}

<h2 id="good-bad">Good vs bad test cases</h2>
<div class="tbl"><table>
<thead><tr><th>Bad</th><th>Better</th></tr></thead>
<tbody>
<tr><td>“Check login works.”</td><td>“Log in with tester01 / Pass@123. Expected: dashboard opens with ‘Hi Riya’.”</td></tr>
<tr><td>“Enter invalid data.”</td><td>“Enter 250 in Age. Expected: ‘Age must be between 18 and 60’.”</td></tr>
<tr><td>Expected: “Correct discount.”</td><td>Expected: “15% of ₹1,200 = ₹180 off, You pay ₹1,020.”</td></tr>
<tr><td>One case checks login, profile and logout.</td><td>Three cases, one for each, so a failure points to one place.</td></tr>
</tbody></table></div>
<p>The rule behind every row: someone else should be able to run your test case without asking you anything, and agree with you on pass or fail.</p>

<h2 id="tips">Tips that make test cases last</h2>
<ul>
<li><strong>Write for a new joiner.</strong> If they could not run it on their first day, add detail.</li>
<li><strong>Keep each case independent.</strong> A case should not depend on the previous one having passed.</li>
<li><strong>Link to the requirement.</strong> A traceability matrix (requirement → test cases) shows nothing was missed.</li>
<li><strong>Cover negative paths.</strong> Most real bugs are in what the user should not be able to do.</li>
<li><strong>Review and update.</strong> When the product changes, outdated test cases cause false failures and lost trust.</li>
<li><strong>Do the maths yourself.</strong> Totals, taxes, percentages and dates should be calculated in your expected result.</li>
</ul>
{{bug:fe-emi-math}}

<h2 id="template">Test case template</h2>
<pre class="http tpl"><code>Test case ID:
Title:
Module / requirement:
Preconditions:
Test data:
Steps:
1.
2.
3.
Expected result:
Actual result:
Status: Pass / Fail / Blocked / Not run
Priority: High / Medium / Low</code></pre>
<p>Want to practise? Take any bug from the <a href="/bugs/">Bug library</a> and write the test case that would have caught it. Then try the full set in our <a href="/articles/test-cases-for-login-page.html">40 login page test cases</a>.</p>
`,
  faq: [
    ['What is the format of a test case?', 'Test case ID, title, module or requirement, preconditions, test data, steps, expected result, actual result, status and priority.'],
    ['What is the difference between a test case and a test scenario?', 'A test scenario says what to test in one line, such as “check the cart total”. A test case says exactly how, with steps, data and an expected result. One scenario usually has several test cases.'],
    ['How many test cases should one feature have?', 'There is no fixed number. Cover each requirement with positive cases, negative cases and boundary values. A simple form can need 20 to 40 cases.'],
    ['Which tools are used to write test cases?', 'Excel or Google Sheets for small teams, and TestRail, Zephyr, Xray or Azure Test Plans in larger companies.'],
  ],
};
