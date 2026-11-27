export default {
  slug: 'manual-testing-interview-questions',
  title: '35 manual testing interview questions for freshers, with answers',
  seoTitle: 'Manual testing interview questions for freshers (35 with answers)',
  description: '35 manual testing interview questions asked to freshers in India, with short answers and real bug examples: basics, test cases, bugs, SDLC and scenarios.',
  topic: 'basics',
  kind: 'Interview prep',
  published: '2026-11-26',
  featured: true,
  lede: 'These are the questions freshers are asked most often in manual testing and QA interviews, with short answers you can say out loud and real bugs you can use as examples.',
  related: ['error-defect-bug-failure', 'bug-severity-vs-priority', 'test-cases-for-login-page', 'bug-life-cycle', 'how-to-write-a-bug-report', 'how-to-write-a-test-case'],
  libraryLinks: [['/', 'Practise spotting bugs: today’s 8-bug quiz', 'Free, no sign-up']],
  body: `
<p>Most fresher interviews for QA, manual testing and software tester roles follow the same pattern: basics first, then test cases and bugs, then process, then one or two “how would you test this?” scenarios. The answers below are short on purpose. Say the one-line answer, then add an example. Examples are what make an interviewer remember you.</p>

<h2 id="basics">Testing basics</h2>
<p><strong>1. What is software testing?</strong><br>Checking a product to find differences between what it should do (expected) and what it actually does (actual), so problems are found before users find them.</p>
<p><strong>2. Why is testing needed?</strong><br>Because people make mistakes. Testing finds them early, when they are cheap to fix, and protects users, money and the company’s name.</p>
<p><strong>3. What is the difference between error, defect, bug and failure?</strong><br>An error is a human mistake. It leaves a defect in the product, which we usually call a bug. When the defect shows up in real use, it is a failure. <a href="/articles/error-defect-bug-failure.html">Full explanation with an example</a>.</p>
<p><strong>4. What is the difference between verification and validation?</strong><br>Verification asks “are we building the product right?” (reviews of documents, designs and code, without running it). Validation asks “are we building the right product?” (running the software and checking it meets user needs).</p>
<p><strong>5. What is the difference between QA and QC?</strong><br>Quality assurance improves the process so defects are prevented. Quality control checks the product to find defects. Testing is part of QC.</p>
<p><strong>6. What are the seven principles of testing?</strong><br>Testing shows the presence of defects, not their absence; exhaustive testing is impossible; test early; defects cluster together; the pesticide paradox (the same tests stop finding new bugs); testing depends on context; and absence of errors is a fallacy (a bug-free product can still be useless).</p>
<p><strong>7. What is the difference between manual and automation testing?</strong><br>Manual testing is done by a person following steps and using judgement. Automation uses scripts to repeat checks quickly. Manual is better for exploratory, usability and new features; automation for regression and repeated checks.</p>

<h2 id="types">Types and levels of testing</h2>
<p><strong>8. What are the levels of testing?</strong><br>Unit testing (single function, by developers), integration testing (modules working together), system testing (the whole product) and acceptance testing (by the client or users, also called UAT).</p>
<p><strong>9. What is the difference between functional and non-functional testing?</strong><br>Functional testing checks what the system does (login, payment, search). Non-functional testing checks how well it does it (speed, security, usability, compatibility).</p>
<p><strong>10. What is black box, white box and grey box testing?</strong><br>Black box: test without seeing the code. White box: test with knowledge of the code, such as paths and conditions. Grey box: some knowledge, for example checking the database or API while testing the screen.</p>
<p><strong>11. What is the difference between smoke and sanity testing?</strong><br>Smoke testing is a quick, broad check that a new build is stable enough to test at all. Sanity testing is a quick, narrow check that a specific fix or feature works before deeper testing.</p>
<p><strong>12. What is regression testing?</strong><br>Re-testing existing features after a change, to make sure the change did not break something that used to work.</p>
<p><strong>13. What is the difference between retesting and regression testing?</strong><br>Retesting checks that a specific bug is fixed, using the same steps. Regression checks that the fix did not break anything else.</p>
<p><strong>14. What is exploratory testing?</strong><br>Learning, designing and running tests at the same time, without written test cases, guided by curiosity and experience. It finds bugs that scripted tests miss.</p>
<p><strong>15. What is ad hoc testing?</strong><br>Informal testing without any plan or documentation, often trying random inputs to break the product.</p>

{{try}}

<h2 id="cases">Test cases and test design</h2>
<p><strong>16. What is a test case? What fields does it have?</strong><br>Steps, data and an expected result that check one thing. Fields: ID, title, preconditions, test data, steps, expected result, actual result, status, priority. <a href="/articles/how-to-write-a-test-case.html">How to write a test case</a>.</p>
<p><strong>17. What is the difference between a test case and a test scenario?</strong><br>A scenario is what to test in one line. A test case is exactly how, with steps and an expected result.</p>
<p><strong>18. What is boundary value analysis?</strong><br>Testing at the edges of allowed ranges, because that is where bugs hide. For an age field of 18 to 60, test 17, 18, 60 and 61.</p>
{{bug:age-250}}
<p><strong>19. What is equivalence partitioning?</strong><br>Dividing inputs into groups that should behave the same and testing one value from each group, to cut the number of tests without losing coverage.</p>
<p><strong>20. What is a traceability matrix (RTM)?</strong><br>A table that maps each requirement to its test cases, so you can prove every requirement was tested.</p>
<p><strong>21. Write test cases for a login page.</strong><br>Name the groups first: positive, negative, security, UI and performance. Then give examples from each. <a href="/articles/test-cases-for-login-page.html">40 login page test cases</a>.</p>

<h2 id="bugs">Bugs and bug reports</h2>
<p><strong>22. What does a good bug report contain?</strong><br>Title, environment, preconditions, steps to reproduce, expected result, actual result, severity, priority, evidence and notes. <a href="/articles/how-to-write-a-bug-report.html">Example and template</a>.</p>
<p><strong>23. What is the difference between severity and priority?</strong><br>Severity is how bad the bug is; the tester sets it. Priority is how soon to fix it; the product owner sets it. <a href="/articles/bug-severity-vs-priority.html">Examples of all four combinations</a>.</p>
<p><strong>24. Give an example of low severity, high priority.</strong><br>A spelling mistake on the main sign-in button. It harms nothing, but every visitor sees it.</p>
{{bug:cta-typo}}
<p><strong>25. Give an example of high severity, low priority.</strong><br>A crash in an old app version almost nobody uses, or in a feature that is not released yet.</p>
<p><strong>26. Explain the bug life cycle.</strong><br>New, Assigned, Open, Fixed, Retest, Verified, Closed, with side paths Rejected, Duplicate, Deferred and Reopened. <a href="/articles/bug-life-cycle.html">Every status explained</a>.</p>
<p><strong>27. What do you do if a developer says “it is not a bug”?</strong><br>Check the requirement again, reproduce it, add evidence, and if you still disagree, ask the product owner to decide. Stay polite and factual.</p>
<p><strong>28. What do you do if a bug cannot be reproduced?</strong><br>Note the exact environment, data and time, check the logs, record a video, and try other devices or accounts. Log it with everything you know and mark how often it happens.</p>

<h2 id="process">SDLC, STLC and Agile</h2>
<p><strong>29. What is the STLC?</strong><br>Software testing life cycle: requirement analysis, test planning, test case design, test environment setup, test execution and test closure.</p>
<p><strong>30. What is the difference between SDLC and STLC?</strong><br>SDLC covers building the whole product, from requirements to maintenance. STLC is the testing part inside it.</p>
<p><strong>31. What is a test plan?</strong><br>A document that says what will be tested, how, by whom, on which environments, with what entry and exit criteria, risks and schedule.</p>
<p><strong>32. What is the role of a tester in Agile?</strong><br>Testers join from the start of each sprint: they review user stories, help write acceptance criteria, test as features are built and keep regression running. Testing is not a separate phase at the end.</p>
<p><strong>33. What are entry and exit criteria?</strong><br>Entry criteria must be met before testing starts (for example, build deployed and smoke test passed). Exit criteria say when testing can stop (for example, all high-priority cases run and no open critical bugs).</p>

<h2 id="scenarios">Scenario questions</h2>
<p><strong>34. How would you test a pen / a lift / a water bottle?</strong><br>This checks how you think, not your knowledge of pens. Ask questions first (who uses it, what is it for), then list functional, non-functional, negative and safety checks. Structure beats a long list.</p>
<p><strong>35. How would you test a shopping cart?</strong><br>Start with the maths: add the totals yourself, check discounts, tax and delivery. Then quantities (0, negative, very large), stock limits, coupons that expired, prices changing between cart and checkout, and what happens if the payment fails.</p>
{{bug:neg-qty}}
{{bug:fe-expired-coupon}}

<h2 id="prepare">How to prepare in one week</h2>
<ul>
<li><strong>Day 1 to 2:</strong> basics and types of testing (questions 1 to 15). Say each answer out loud.</li>
<li><strong>Day 3:</strong> write test cases for a login page and a cart in a spreadsheet.</li>
<li><strong>Day 4:</strong> write three bug reports for bugs you find in real apps you use.</li>
<li><strong>Day 5:</strong> severity, priority and the bug life cycle with your own examples.</li>
<li><strong>Every day:</strong> play the <a href="/">QuizzifyTech daily quiz</a>. Spotting 8 real bugs a day trains the same eye interviewers test in scenario questions, and gives you real examples to talk about.</li>
</ul>
`,
  faq: [
    ['What questions are asked in a manual testing interview for freshers?', 'Mostly basics (what is testing, error vs bug vs failure, verification vs validation), types of testing (smoke, sanity, regression), test cases and test design, bug reports, severity vs priority, the bug life cycle, STLC and one or two scenario questions such as testing a login page.'],
    ['How do I prepare for a manual testing interview?', 'Learn short answers to the common questions, practise writing test cases and bug reports for real apps, prepare two or three examples of bugs you found, and practise thinking out loud on scenario questions.'],
    ['Is manual testing a good career for freshers in India?', 'Yes, it is a common entry point into IT. Many testers later move into automation, API testing, performance testing or QA lead roles, so learning one automation tool alongside manual testing helps.'],
    ['What is the most important skill for a manual tester?', 'Attention to detail combined with clear writing: noticing that something is wrong, and describing it so precisely that a developer can reproduce it from the report alone.'],
  ],
};
