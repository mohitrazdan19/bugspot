export default {
  slug: 'common-api-bugs',
  title: '10 common API bugs every tester should know',
  seoTitle: '10 common API bugs every tester should know (with examples)',
  description: 'A 200 OK can still be broken. The ten API bugs testers find most often, how to spot each one in the response, and a checklist for your next test.',
  topic: 'api',
  kind: 'Guide',
  published: '2026-11-24',
  lede: 'A 200 OK can still be broken. These are the API bugs we see most often, how to spot each one in the response, and a checklist you can use on your next test run.',
  related: ['bug-severity-vs-priority', 'how-to-write-a-bug-report', 'checkout-bugs'],
  libraryLinks: [['/bugs/#api', 'All API bugs in the Bug library', 'Bug library']],
  body: `
<p>Most API testing stops at the status code. The request went through, the response was 200, the test passed. But many of the worst bugs live inside the body of a successful response, where nobody looks. An API can return the wrong customer, leak a password hash or quietly ignore your filter, and still answer with a cheerful 200.</p>
<p>Below are ten API bugs that show up again and again in real products. For each one you get what it looks like, why it matters and the one check that catches it. Every example links to a page in our Bug library, and you can try to spot each bug yourself before reading the answer.</p>

<h2 id="wrong-record"><span class="n">1</span>The API returns the wrong record</h2>
<p>You ask for user 17 and get user 18. The response looks perfect: right shape, right fields, status 200. Only the id gives it away. An off-by-one in a lookup, a wrong index or a cached response can show one customer another customer’s profile, which turns a small coding slip into a privacy incident.</p>
<pre class="http">GET /api/users/17
200 OK
{ <span class="bad">"id": 18</span>, "name": "Arjun Mehta", ... }</pre>
<p><strong>How to catch it:</strong> compare the id in the response with the id you asked for, every time. In automated tests this is a single line, and it is one of the most valuable lines you can write.</p>
{{bug:api-wrong-id}}

<h2 id="error-in-200"><span class="n">2</span>An error hidden inside a 200 OK</h2>
<p>The status says success, but the body says <code>"error": "Order not found"</code>. Apps that trust the status code will treat a failure as a success: they show an empty order, cache the error or move the user to the next step as if nothing went wrong.</p>
<pre class="http">GET /api/orders/99999
<span class="bad">200 OK</span>
{ "error": "Order not found" }</pre>
<p><strong>How to catch it:</strong> assert the status code and the body together. A missing record should be a 404, bad input a 400, a server problem a 5xx. If the body contains an error, the status must not be 2xx.</p>
{{bug:api-200}}

<h2 id="leaked-fields"><span class="n">3</span>Private fields leak to the browser</h2>
<p>The profile screen shows a name and an email, but the API sends the whole database row, including the password hash. Nobody sees it on screen, but anyone can see it in the browser’s network tab. Tokens, internal flags, other users’ emails and admin notes leak the same way, usually because the code returns a full object instead of picking safe fields.</p>
<p><strong>How to catch it:</strong> read every field in the response, not just the ones the screen uses. Ask for each field: would I be happy if a stranger read this?</p>
{{bug:api-hash-leak}}

{{try}}

<h2 id="limits"><span class="n">4</span>Pagination and limits are ignored</h2>
<p>You ask for <code>limit=10</code> and get 12 items. It sounds harmless, but on the next page some orders will repeat and others will never be shown. Users will say “my order disappeared”, and nobody will be able to reproduce it.</p>
<p><strong>How to catch it:</strong> count the items on the first, a middle and the last page. Walk through every page and check that no item appears twice and none goes missing. Try <code>limit=0</code>, a negative limit and a very large one too.</p>
{{bug:api-limit}}

<h2 id="sort-filter"><span class="n">5</span>Sort and filter parameters do not work</h2>
<p>You sort by price from low to high and get ₹249, ₹1,299, ₹899, ₹1,999. The classic cause is sorting numbers as text, where “1299” comes before “899” because 1 comes before 8. The same thing happens with filters that are silently ignored when a parameter name is misspelt.</p>
<p><strong>How to catch it:</strong> test sorting with values of different lengths, such as 99, 899 and 1,299. For filters, check that every item in the response really matches the filter, not just the first few.</p>
{{bug:api-sort-ignored}}

<h2 id="dates"><span class="n">6</span>Impossible dates</h2>
<p>An order placed near the end of February gets a delivery date of <code>2026-02-31</code>. Date maths done by hand (adding days to the day number without moving the month) breaks at month ends and leap years. Time zones cause the same class of bug: a date that is right in UTC can be a day off for a user in India.</p>
<p><strong>How to catch it:</strong> test dates around the 28th to the 31st, on 29 February, at the end of the year, and close to midnight in your users’ time zone. Parse every date in the response and check that it is a real date.</p>
{{bug:api-bad-date}}

<h2 id="negative-values"><span class="n">7</span>Values the screen blocks, but the API accepts</h2>
<p>The app’s quantity picker stops at 1, so testers assume negative quantities are impossible. But the API is a separate door. Send <code>"qty": -3</code> straight to the cart API and it may accept it and make the order total negative. Anyone with a browser’s developer tools or a tool like Postman can do this.</p>
<pre class="http">POST /api/cart/items
{ "productId": 4, <span class="bad">"qty": -3</span> }

200 OK
{ "total": <span class="bad">-3897</span> }</pre>
<p><strong>How to catch it:</strong> call the API directly with values the screen never sends: negative numbers, zero, huge numbers, empty strings, very long text and the wrong data types. The server must validate everything itself.</p>
{{bug:api-negative-qty}}

<h2 id="ghost-data"><span class="n">8</span>Deleted data comes back</h2>
<p>You delete item 9 from the cart and get a <code>204 No Content</code>. Then you read the cart and item 9 is still there. The delete may have hit a cache, a different replica or the wrong table. Either way, the success code lied.</p>
<p><strong>How to catch it:</strong> after every create, update or delete, read the data back and check that it really changed. A status code only tells you what the server thinks happened.</p>
{{bug:api-delete-ghost}}

<h2 id="tokens"><span class="n">9</span>Tokens that never expire</h2>
<p>Access tokens are meant to be short lived, often around 15 minutes, so a stolen token stops working quickly. If a token is issued with an expiry ten years away, anyone who copies it from a log, a shared screenshot or a public Wi-Fi network can use the account for a decade.</p>
<p><strong>How to catch it:</strong> decode the token (for a JWT, any JWT decoder will do) and read the <code>exp</code> value. Also check that old tokens stop working after sign-out and after a password change.</p>
{{bug:api-token-expiry}}

<h2 id="cors"><span class="n">10</span>CORS that trusts every website</h2>
<p>CORS headers tell the browser which other websites may read your API’s responses. A common shortcut is to copy whatever <code>Origin</code> the request sends back into <code>Access-Control-Allow-Origin</code>, together with <code>Access-Control-Allow-Credentials: true</code>. That lets any website a signed-in user visits read their account data.</p>
<pre class="http">GET /api/account
Origin: https://evil.example

200 OK
<span class="bad">Access-Control-Allow-Origin: https://evil.example</span>
Access-Control-Allow-Credentials: true</pre>
<p><strong>How to catch it:</strong> send a request with a made-up <code>Origin</code> header and read the response headers. Only your own domains should ever be allowed when credentials are allowed.</p>
{{bug:api-cors}}

<h2 id="more">Two more to keep in mind</h2>
<p><strong>Error messages that say too much.</strong> Send a text id where a number is expected. If the error shows a stack trace, a database host name or file paths, attackers get a map of your system. Errors should be short; details belong in server logs.</p>
{{bug:api-stack-trace}}
<p><strong>Required fields that come back null.</strong> An active product with <code>"name": null</code> shows up as a blank card, or as the word “null” on screen. Check that required fields are always present and never empty.</p>
{{bug:api-null-name}}

<section class="check"><h3>Your API test checklist</h3><ul>
<li>The id in the response matches the id you asked for</li>
<li>The status code and the body agree (no errors inside a 2xx)</li>
<li>No password hash, token or internal field in any response</li>
<li>limit, page, sort and filter are really applied</li>
<li>Every date is a real date, in the right time zone</li>
<li>Negative, zero, huge and wrong-type values are rejected with a 400</li>
<li>After a write, reading the data back shows the change</li>
<li>Tokens expire, and old ones stop working after sign-out</li>
<li>CORS allows only your own domains</li>
<li>Error responses are short and reveal nothing internal</li>
</ul></section>

<p>None of these checks needs automation to start. A browser’s network tab, Postman or curl is enough to find every bug on this page. Once you have found one by hand, turn it into an automated check so it never comes back.</p>
`,
  faq: [
    ['What is the most common API bug?', 'Responses that pass on the status code but carry wrong or missing data in the body, such as the wrong record, a null required field or an error message inside a 200 OK.'],
    ['Do I need to write code to test an API?', 'No. Postman, the browser’s network tab or curl is enough to find every bug in this guide. Code helps later, when you want to repeat the checks on every build.'],
    ['Why test the API if the screen already blocks bad input?', 'The screen is only one way in. Anyone can call the API directly with values the screen never sends, so the server must validate every input on its own.'],
    ['What status code should an API return when a record is not found?', 'Usually 404 Not Found, with a short error message in the body. Returning 200 OK with an error message makes clients treat the failure as a success.'],
  ],
};
