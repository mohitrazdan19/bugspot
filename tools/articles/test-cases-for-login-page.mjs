export default {
  slug: 'test-cases-for-login-page',
  title: '40 test cases for a login page (functional, negative, security and UI)',
  seoTitle: 'Test cases for login page: 40 examples with expected results',
  description: 'Login page test cases with expected results: positive, negative, OTP, security and UI checks. Ready to use at work or in a QA interview.',
  topic: 'basics',
  kind: 'Checklist',
  published: '2026-11-26',
  lede: '“Write test cases for a login page” is the most asked practical question in QA interviews. Here are 40 test cases, grouped the way an experienced tester thinks about them.',
  related: ['how-to-write-a-test-case', 'manual-testing-interview-questions', 'how-to-write-a-bug-report'],
  libraryLinks: [['/bugs/password-plain.html', 'Password visible while the field says hidden', 'Bug library'], ['/bugs/otp-shown.html', 'OTP shown on the verification screen', 'Bug library']],
  body: `
<p>A login page has two fields and one button, which is exactly why interviewers love it. Anyone can list five test cases. A good tester lists forty, because they think about the data, the server, the attacker, the slow network and the person using a screen reader, not just the happy path.</p>
<p>Use this list as a checklist at work, or learn the groups for your next interview. Each test case has an expected result, because a test case without one is just an idea.</p>

<h2 id="positive">Positive test cases</h2>
<p>These check that the login works for a real user doing the right thing.</p>
<div class="tbl"><table>
<thead><tr><th>#</th><th>Test case</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td>1</td><td>Log in with a valid username and valid password</td><td>User lands on the home or dashboard page, signed in</td></tr>
<tr><td>2</td><td>Log in with a registered email instead of a username (if allowed)</td><td>Login succeeds</td></tr>
<tr><td>3</td><td>Log in with a registered mobile number and correct OTP</td><td>Login succeeds</td></tr>
<tr><td>4</td><td>Press Enter in the password field instead of clicking Login</td><td>Form submits, same as clicking Login</td></tr>
<tr><td>5</td><td>Tick “Remember me”, log in, close and reopen the browser</td><td>User is still signed in</td></tr>
<tr><td>6</td><td>Log in, then click Logout</td><td>Session ends; the back button does not show the signed-in page</td></tr>
<tr><td>7</td><td>Email with capital letters (Riya@Mail.com) for an account saved in lower case</td><td>Login succeeds, emails are compared without case</td></tr>
<tr><td>8</td><td>Email with a space before or after it</td><td>Spaces are trimmed and login succeeds</td></tr>
</tbody></table></div>
<p>Cases 7 and 8 look small, but they hide real database bugs. If an email was saved with a trailing space, that user may never be able to sign in.</p>
{{bug:db-trailing-space}}

<h2 id="negative">Negative test cases</h2>
<p>These check that the login refuses what it should refuse, with a helpful message.</p>
<div class="tbl"><table>
<thead><tr><th>#</th><th>Test case</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td>9</td><td>Valid username, wrong password</td><td>Login fails with a general message such as “Email or password is incorrect”</td></tr>
<tr><td>10</td><td>Unregistered username, any password</td><td>The same general message as case 9, so attackers cannot tell which accounts exist</td></tr>
<tr><td>11</td><td>Both fields empty, click Login</td><td>Both fields show “required” messages; no request is sent</td></tr>
<tr><td>12</td><td>Username filled, password empty</td><td>Password field shows “required”</td></tr>
<tr><td>13</td><td>Password in the wrong case (PASSWORD instead of password)</td><td>Login fails: passwords are case sensitive</td></tr>
<tr><td>14</td><td>Invalid email format such as riya@@mail..com</td><td>Field shows “Enter a valid email”</td></tr>
<tr><td>15</td><td>Only spaces in both fields</td><td>Treated as empty</td></tr>
<tr><td>16</td><td>Very long input (500+ characters)</td><td>Input is limited or rejected cleanly; no crash or server error</td></tr>
<tr><td>17</td><td>Login with a deactivated or deleted account</td><td>Login fails with a clear message to contact support</td></tr>
<tr><td>18</td><td>Wrong OTP, then an expired OTP</td><td>Both rejected with the right message</td></tr>
<tr><td>19</td><td>Use the same OTP a second time</td><td>Rejected: an OTP works only once</td></tr>
</tbody></table></div>
{{bug:email-val}}
{{bug:be-otp-reuse}}

<h2 id="security">Security test cases</h2>
<p>This is the group that separates freshers from experienced testers in an interview. Even if you are not a security tester, you should check these.</p>
<div class="tbl"><table>
<thead><tr><th>#</th><th>Test case</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td>20</td><td>Type in the password field</td><td>Characters are masked; the show/hide eye icon works both ways</td></tr>
<tr><td>21</td><td>Check the login request in browser DevTools (Network tab)</td><td>Sent over https with POST; the password is never in the URL</td></tr>
<tr><td>22</td><td>Enter a wrong password 5 times</td><td>Account is locked for a while or a CAPTCHA appears</td></tr>
<tr><td>23</td><td>Enter <code>' OR '1'='1</code> in both fields (SQL injection)</td><td>Login fails normally; no database error is shown</td></tr>
<tr><td>24</td><td>Enter <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> as username</td><td>Shown as plain text, never run as a script</td></tr>
<tr><td>25</td><td>Copy the password field and paste it elsewhere</td><td>Copying from the password field is blocked</td></tr>
<tr><td>26</td><td>Change the password on one device, then use the old session on another</td><td>The old session is signed out</td></tr>
<tr><td>27</td><td>Wrong password returns which status code? (check in DevTools)</td><td>401 or 400 with a clean message, not 500</td></tr>
<tr><td>28</td><td>Read the error responses and the page source</td><td>No stack traces, database names or server paths</td></tr>
<tr><td>29</td><td>Check the OTP screen and the API response</td><td>The OTP is never shown on screen or sent back in the response</td></tr>
</tbody></table></div>
{{bug:pass-url}}
{{bug:api-500-login}}
{{bug:be-old-session}}

{{try}}

<h2 id="ui">UI and usability test cases</h2>
<div class="tbl"><table>
<thead><tr><th>#</th><th>Test case</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td>30</td><td>Check labels, placeholders and button text for spelling</td><td>No typos, such as “Sing in”</td></tr>
<tr><td>31</td><td>Press Tab from the top of the page</td><td>Focus moves username → password → Login in a logical order</td></tr>
<tr><td>32</td><td>Open the page on a small phone (360 px wide)</td><td>Fields and button fit; nothing is cut off or overlapping</td></tr>
<tr><td>33</td><td>Open the on-screen keyboard on mobile</td><td>The Login button is still reachable</td></tr>
<tr><td>34</td><td>Use a screen reader</td><td>Each field and button is read out with a clear name</td></tr>
<tr><td>35</td><td>Check the “Forgot password” link</td><td>Opens the reset flow</td></tr>
<tr><td>36</td><td>Error message colour and wording</td><td>Errors look like errors (not green) and say how to fix the problem</td></tr>
</tbody></table></div>
{{bug:cta-typo}}

<h2 id="other">Performance and compatibility</h2>
<div class="tbl"><table>
<thead><tr><th>#</th><th>Test case</th><th>Expected result</th></tr></thead>
<tbody>
<tr><td>37</td><td>Log in on Chrome, Firefox, Safari and Edge</td><td>Works the same everywhere</td></tr>
<tr><td>38</td><td>Log in on a slow 3G network (DevTools throttling)</td><td>A loading state shows; the button cannot be pressed twice</td></tr>
<tr><td>39</td><td>Double click the Login button quickly</td><td>Only one login request is sent</td></tr>
<tr><td>40</td><td>Response time for login under normal load</td><td>Within the agreed limit, for example under 2 seconds</td></tr>
</tbody></table></div>

<h2 id="interview">How to answer this in an interview</h2>
<p>Do not read out forty cases. Interviewers want to see how you think. Say the groups first: “I would cover positive cases, negative cases, security, UI and accessibility, and performance.” Then give two or three strong examples from each group, and finish with one case most people forget, such as the same OTP working twice or the old session staying alive after a password change. If they ask for the format, use the columns from our guide on <a href="/articles/how-to-write-a-test-case.html">how to write a test case</a>.</p>
`,
  faq: [
    ['How many test cases can you write for a login page?', 'Easily 40 or more when you include positive, negative, security, UI, accessibility, performance and compatibility checks. In an interview, name the groups and give a few strong examples from each.'],
    ['What are negative test cases for a login page?', 'Wrong password, unregistered user, empty fields, invalid email format, password in the wrong case, very long input, a deleted account and wrong, expired or reused OTPs.'],
    ['What security test cases should a login page have?', 'Password masking, https with POST, no password in the URL, account lock after repeated failures, SQL injection and script injection checks, no stack traces in errors, and old sessions ending after a password change.'],
    ['Should the error message say whether the username or the password is wrong?', 'No. A general message such as “Email or password is incorrect” stops attackers from finding out which accounts exist.'],
  ],
};
