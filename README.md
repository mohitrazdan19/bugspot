# Bugspot

A daily spot-the-bug game for QA testers. One file, `index.html`, hosted on GitHub Pages.

## Guest and signed-in play
- Everyone gets the same 8 bugs each day (3 easy, 3 medium, 2 hard).
- Guests play the first 3. Signed-in players play all 8 and unlock practice levels.
- Practice levels: Easy, Medium, Hard. Solving 75% of a level opens the next.

## Sign-in setup (done for project `bugspot`)
1. Create a Supabase project and run `supabase/schema.sql`. Done.
2. In Supabase, Authentication, URL Configuration: set Site URL and add a Redirect URL of `https://mohitrazdan19.github.io/bugspot/`.
3. Put the project URL and the publishable key in `CONFIG` near the top of the game script in `index.html`. Done.
4. Optional: enable the Google provider and set `GOOGLE: true`.

Supabase's built-in email sender allows only a few emails an hour. Add a custom SMTP sender before a public launch.

The 3-bug limit for guests is enforced in the browser only. It is a gentle nudge, not security.
