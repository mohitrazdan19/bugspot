export default {
  slug: 'checkout-bugs',
  title: '12 checkout bugs testers miss, and how to catch them',
  seoTitle: '12 checkout bugs testers miss (cart, discount and payment testing)',
  description: 'Totals that do not add up, discounts on the wrong base, prices that change at checkout and double charges. A practical checklist for testing carts and payments.',
  topic: 'frontend',
  kind: 'Checklist',
  published: '2026-11-24',
  draft: true, // held back by Mohit 24 Nov; remove this line to publish (and set published to that day)
  lede: 'The checkout is where an app makes its money, and where small bugs cost the most. Here are twelve checkout bugs that slip through testing, grouped by where they hide.',
  related: ['common-api-bugs', 'bug-severity-vs-priority'],
  libraryLinks: [['/bugs/#frontend', 'All Frontend bugs in the Bug library', 'Bug library']],
  body: `
<p>A checkout screen looks simple: a few items, a total and a Pay button. But it brings together prices, offers, tax, delivery, stock, currency and a payment gateway, and each one can go wrong on its own. Most checkout bugs are not crashes. They are numbers that are slightly wrong, which is why they get past a quick look and why customers notice them first.</p>
<p>The bugs below come from our Bug library. Each one links to a fake app screen where you can try to find it yourself.</p>

<h2 id="maths">Part 1: the maths</h2>
<p>The single most useful habit in checkout testing is to add the numbers up yourself, on every screen, every time. A calculator is a testing tool.</p>

<h3><span class="n">1</span> The total does not add up</h3>
<p>Items come to ₹1,125, delivery is ₹40, and the total says ₹1,065 instead of ₹1,165. The page looks fine and nobody reads the numbers, except the customer and, later, the finance team. Totals go wrong when one line is left out, counted twice or rounded differently from the rest.</p>
{{bug:cart-total}}

<h3><span class="n">2</span> The discount uses the wrong base</h3>
<p>A 15% offer on ₹1,200 should save ₹180, so the customer pays ₹1,020. If the screen says ₹1,080, the discount was probably worked out on a different amount (such as the price after another offer) or rounded at the wrong step. Work out every percentage by hand.</p>
{{bug:discount}}

<h3><span class="n">3</span> “You saved” goes negative</h3>
<p>Savings lines are often calculated separately from the total, so they drift. A promo worth ₹50 shown as “You saved ₹-120” tells the customer the offer cost them money. Check that the saving matches the difference between the original and the final price, and that its sign is right.</p>
{{bug:savings}}

<h3><span class="n">4</span> Tax is calculated wrongly</h3>
<p>GST at 18% on ₹1,500 is ₹270. A screen that shows ₹207 has swapped two digits, and every invoice is now wrong. Tax bugs are always serious, because they create legal and accounting problems as well as unhappy customers. Test tax on at least two different amounts, and on amounts with paise, where rounding matters.</p>
{{bug:gst-wrong}}

<h2 id="journey">Part 2: across the journey</h2>
<p>Many checkout bugs only appear when you compare one step with the next: cart, checkout, payment, confirmation and invoice should all tell the same story.</p>

<h3><span class="n">5</span> The price changes between cart and checkout</h3>
<p>The cart shows ₹799, the checkout shows and charges ₹899. This usually comes from a cached price or an offer that expired between two screens. Customers see it as a bait and switch. Note the price of each item on the product page, in the cart, at checkout and on the invoice, and compare them.</p>
{{bug:stale-price}}

<h3><span class="n">6</span> The wrong currency appears on one line</h3>
<p>A rupee order with “Delivery $49” on one line looks careless at best and suspicious at worst, especially after a localisation change. Check every currency symbol, every thousands separator and every decimal on the summary, not only the total.</p>
{{bug:currency}}

<h3><span class="n">7</span> Quantities below one are accepted</h3>
<p>Tap minus on a quantity of 1 and the cart shows −1 with a negative price. The same bug often exists in the cart API, where the screen’s limits do not apply at all. Try 0, −1 and a very large quantity, both in the app and by calling the API directly.</p>
{{bug:neg-qty}}

{{try}}

<h2 id="layout">Part 3: the screen itself</h2>
<p>Checkout screens are often used on small phones, on slow networks and in a hurry. Layout bugs that would be minor elsewhere can stop a payment here.</p>

<h3><span class="n">8</span> The keyboard hides the Pay button</h3>
<p>On a small phone, tapping the last field opens the keyboard, which covers the Pay button, and the page will not scroll. The customer cannot finish the order without closing the keyboard, and some will simply give up. Always test forms with the keyboard open, on a small screen, in both orientations.</p>
{{bug:keyboard}}

<h3><span class="n">9</span> A button covers the price</h3>
<p>On a narrow screen, or with a larger text size, the “Add to cart” button can be drawn on top of the price. Test with the phone’s text size turned up, with long product names and in other languages, which are often longer than English.</p>
{{bug:overlap}}

<h3><span class="n">10</span> The total is hard to read</h3>
<p>Light grey text on a white background might match the design, but the most important number on the page should be the easiest to read. Normal text needs a contrast ratio of at least 4.5 to 1. Free contrast checkers will tell you in seconds.</p>
{{bug:contrast}}

<h2 id="payment">Part 4: the payment</h2>
<p>The last step is where the most expensive bugs live, because real money has already moved.</p>

<h3><span class="n">11</span> “Payment failed”, but the money was taken</h3>
<p>The screen says the payment failed, and right below it the order is confirmed and charged. The customer will either pay again or call support, and both cost money. This usually happens when the app times out before the payment gateway answers. Test slow networks, timeouts and what the app does when the answer arrives late.</p>
{{bug:failed-but-charged}}

<h3><span class="n">12</span> A retry charges the customer twice</h3>
<p>Payment systems use an idempotency key so that the same request, sent twice, is only processed once. If the server ignores the key, a double tap, a network retry or a refresh can charge the customer twice. Test the Pay button with a double tap, a refresh during payment and a poor connection, and check the payments list afterwards.</p>
{{bug:be-double-charge}}

<section class="check"><h3>Your checkout test checklist</h3><ul>
<li>Items + delivery + tax − discounts = total, added up by hand</li>
<li>Every percentage worked out on the right base amount</li>
<li>Savings are positive and match the real difference</li>
<li>Tax is right on at least two amounts, including paise</li>
<li>The same price on the product page, cart, checkout and invoice</li>
<li>One currency and one number format on every line</li>
<li>Quantity 0, −1 and very large values are blocked, in the app and the API</li>
<li>Pay button reachable with the keyboard open on a small phone</li>
<li>Readable with a larger text size and in other languages</li>
<li>One clear result after payment, even on a slow network</li>
<li>Double tap and refresh during payment charge only once</li>
</ul></section>

<p>Print this list, or keep it open next to the app the next time you test a checkout. Most of these checks take less than a minute each, and between them they cover the bugs that cost real money.</p>
`,
  faq: [
    ['What should I test first on a checkout page?', 'The maths. Add up the items, delivery, tax and discounts by hand and compare the result with the total on screen. Money bugs are the most serious and the easiest to miss.'],
    ['How do I test a payment without being charged?', 'Use the test or sandbox mode of the payment gateway, with its test card numbers. Never test payments with real cards on production unless your team has a process for it.'],
    ['What is an idempotency key?', 'A unique value sent with a payment request so the server can tell when the same request arrives twice, for example after a retry, and process it only once.'],
    ['Why test checkout on a small phone?', 'Many customers pay on a phone. The keyboard, small screens and large text sizes cause layout bugs, such as a hidden Pay button, that never appear on a laptop.'],
  ],
};
