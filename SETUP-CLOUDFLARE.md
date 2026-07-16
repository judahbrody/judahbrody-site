# Contact form on Cloudflare — one-time setup

The site's contact form now posts to a Cloudflare Pages Function
(`functions/api/contact.js`) which sends the message via Cloudflare's
Email Service to `judahbrody@gmail.com`. The mailto fallback still runs if
the endpoint is ever down or misconfigured, so a lead is never lost.

You need to do a handful of one-time steps in the Cloudflare dashboard
before it works end-to-end. Nothing here needs to happen in code.

---

## Prerequisites

- **DNS on Cloudflare.** The nameservers for judahbrody.com must point to
  Cloudflare. If the domain is registered elsewhere (Namecheap, GoDaddy),
  change the nameservers to Cloudflare's per their onboarding.
- **Workers Paid plan.** ~$5/mo. Email Sending requires it. If you already
  pay for Workers, you're set.

---

## 1. Deploy the site to Cloudflare Pages

If it isn't already:

1. Dashboard → Workers & Pages → Create → Pages → Connect to Git
   (or "Direct Upload" if you're not using a git repo yet).
2. Point it at this repo. Build command: leave blank (static). Build
   output directory: `.` (the repo root).
3. Deploy. You'll get a `*.pages.dev` URL. Then add judahbrody.com as a
   custom domain in Settings → Custom domains.

## 2. Onboard the domain to Email Service

1. Dashboard → Compute (AI) → Email Service → Email Sending.
2. Onboard domain → choose `judahbrody.com`.
3. Approve the DNS records Cloudflare adds (MX for the `cf-bounce`
   subdomain, SPF and DKIM TXT records). Because DNS is already on
   Cloudflare, this takes one click. They must be `active` before
   sending will work.

## 3. Verify judahbrody@gmail.com as a destination in Email Routing

Email Service requires that recipients on `send_email` bindings be
verified destination addresses (this is what lets the free tier send
without a bounce).

1. Dashboard → Email → Email Routing → Destination addresses → Add.
2. Enter `judahbrody@gmail.com`. Click the verification link Cloudflare
   sends to that inbox.

## 4. Add the Email Service binding to the Pages project

1. Dashboard → Workers & Pages → judahbrody (your Pages project) →
   Settings → Bindings → Add.
2. Type: **Email Service**. Variable name: `SEND_EMAIL`.
   Destination address: `judahbrody@gmail.com`.
3. Save. Redeploy the project for the binding to take effect.

The included `wrangler.jsonc` also declares this binding, so if you
deploy via `wrangler pages deploy` from the terminal it wires itself up
without the dashboard step above.

## 5. Set the environment variables

Same page: Settings → Environment variables → Add (for Production).

| Name         | Value                          |
| ------------ | ------------------------------ |
| `TO_EMAIL`   | `judahbrody@gmail.com`         |
| `FROM_EMAIL` | `contact@judahbrody.com`       |
| `FROM_NAME`  | `Judah Brody Productions`      |

The `FROM_EMAIL` local part is arbitrary — nothing needs to actually
exist at `contact@judahbrody.com`. What matters is that the domain is
onboarded to Email Service (step 2). If you'd rather use
`hello@` or `no-reply@` etc., change it here.

Redeploy after adding the vars.

## 6. Test it

Fill out the form on the live site once. You should get an email at
`judahbrody@gmail.com` within a few seconds, with the visitor's info
in the body and `Reply-To` set to their address (so hitting reply goes
back to them, not to Cloudflare).

## If something breaks

- **Form submits but nothing arrives.** Check Pages → Functions → Logs.
  The Function returns JSON `{ok: true}` on success or `{ok: false, ...}`
  with the reason. Most common: `FROM_EMAIL` domain isn't onboarded yet
  (step 2 not finished, or DNS still propagating).
- **Visitor's mail app opens instead of the confirmation.** The client
  fell back to `mailto:` because the fetch to `/api/contact` failed. The
  Function isn't reachable, or the deploy is missing the binding.
  Redeploy after making binding/env changes.
- **DNS says "record already exists" during Email Service onboarding.**
  You have a conflicting SPF or MX record from a previous setup. Delete
  the old one in DNS and re-run onboarding.
