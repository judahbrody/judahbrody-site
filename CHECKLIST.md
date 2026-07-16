# judahbrody.com — cleanup and buildout checklist

Updated after the latest pass. **[needs you]** = blocked on you.
**[note]** = judgment call worth a look.

---

## Done in the latest pass

- **Contact form moved to Formspree** after the Cloudflare Email Service
  path turned out to require Workers Paid. The Cloudflare Pages Function,
  `wrangler.jsonc`, and `SETUP-CLOUDFLARE.md` were removed. The form now
  posts JSON to Formspree with Reply-To set to the visitor and the
  service in the subject line. Honeypot still checked client-side before
  anything is sent; mailto fallback unchanged.
- Zebra favicon set integrated on all 11 pages (ico, 32px PNG, apple
  touch icon, 192/512 manifest icons, transparent master PNG).


## Contact form status

- Switched from Cloudflare Email Service (needed Workers Paid) to
  Formspree free tier. Hosting unchanged: still Cloudflare Pages from
  GitHub.
- Code done. **[needs you]** one 5-minute step: create the Formspree
  form and paste its ID into `contact.html` (see `SETUP-FORMSPREE.md`).
  Until then the mailto fallback covers submissions.


## Priority 1 — Simplify and de-clutter

- [x] 1.1 / 1.2 Work re-sorted, 10 rows.
- [x] 1.3 Contact block only on Contact + About.
- [x] 1.4 Mastercraft wall filled; Rip Current wall hidden until assets.

## Priority 2 — Organize Work and the back catalog

- [x] 2.1 Archive: flat filtered list per your call.
- [x] 2.2 Filter counts kept updated.
- [ ] 2.3 Row caption format is the standing template (convention only).
- [ ] 2.4 Work thumbnails: Rip Current and rows 05, 06 still empty wells.
      **[needs you]**
- [x] 2.5 Link map holds, no dead-ends.

## Priority 3 — Assets and links to supply **[needs you]**

- [ ] 3.1 Work-page wall (6 to 9 tiles) and Rip Current wall (4 tiles)
      still need real posts.
- [x] 3.2 Rip Current hero: local, done.
- [ ] 3.3 Press links: 6 of 9 wired. Still need URLs for NFHS Network,
      VOICE Magazine, KEYT-3 News.
- [ ] 3.4 Client logo audit.
- [ ] og-image.jpg: replace temp with a designed 1200x630.
- [ ] About second image (optional two-image strip).

## Priority 4 — Flair on About and Services

- [x] 4.1a About stat band.
- [x] 4.1b About dateline.
- [x] About essay stretched to full page width. **[note]** long lines at
      desktop widths, flag if it feels like too much.
- [ ] 4.1c Two-image About strip. **[needs you]** second on-shoot portrait.
- [x] 4.2a Services how-it-works.
- [x] 4.2b Services jump nav.
- [x] 4.2c Services closing line. **[note]** does not pre-select "Not sure"
      in the contact form yet.

## Open items for you

- Do the Formspree step in `SETUP-FORMSPREE.md`.
- Row 05, 06 on Work: real title, link, category, or pull them for now.
- Remaining press URLs above.
