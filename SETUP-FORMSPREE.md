# Contact form via Formspree — one-time setup

The form now posts to Formspree (free tier, 50 submissions/month), which
emails each submission to judahbrody@gmail.com. Hosting is unchanged:
the site still deploys to Cloudflare Pages from GitHub. Nothing on
Cloudflare needs configuring for the form anymore, and no paid plan is
required.

The mailto fallback still runs if Formspree is ever unreachable, so a
lead is never lost.

## Setup (5 minutes)

1. Go to formspree.io and create a free account with
   judahbrody@gmail.com. Verify the email.
2. Click **New form**. Name it anything ("Site contact"). The recipient
   defaults to your account email, which is what you want.
3. Formspree shows the form endpoint, something like:
   `https://formspree.io/f/xyzabcde`
   Copy the 8-character ID at the end.
4. In `contact.html`, find this line and replace `YOUR_FORM_ID` with it:

   ```
   data-endpoint="https://formspree.io/f/YOUR_FORM_ID"
   ```

5. Commit and push. Cloudflare Pages redeploys automatically.
6. Submit the live form once to test. First submission may require you
   to click a confirmation link Formspree emails you; after that they
   flow straight to your inbox with Reply-To set to the visitor.

## Optional, worth doing in the Formspree dashboard

- **Restrict domain**: Settings -> allow submissions only from
  judahbrody.com, so nobody else can post to your endpoint.
- **reCAPTCHA**: leave OFF. The form already has a honeypot field, and
  Formspree runs its own spam filtering on the free tier.

## If something breaks

- **Visitor's mail app opens instead of the on-page confirmation**: the
  fetch to Formspree failed. Check the endpoint ID is correct and the
  form is Active in the Formspree dashboard.
- **Submissions stop after 50 in a month**: free tier cap reached.
  Formspree emails you when close. Unlikely at contact-form volume, but
  the mailto fallback keeps working past the cap.
