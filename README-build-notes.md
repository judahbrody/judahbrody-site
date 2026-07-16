# Judah Brody Productions site: build notes and launch checklist

A 6-page static site. No build step, no framework. Open any `.html` file in a
browser and it works. Host anywhere (Netlify, Cloudflare Pages, GitHub Pages,
or plain shared hosting).

## Files

- `index.html`: Home
- `work.html`: Work grid (filterable)
- `archive.html`: Archive of past and published work, filterable, reached from a
  "More" button below the Work grid (not in the main nav)
- `services.html`: Services and pricing prompts
- `about.html`: About
- `contact.html`: Quote form
- `case-study.html`: Case study template. Duplicate once per flagship project.
- `case-mastercraft.html`: Mastercraft Motors case study (built)
- `case-rip-current.html`: Rip Current Sports case study (built)
- `case-state-press.html`: The State Press case study (built)
- `404.html`: Not-found page
- `assets/styles.css`: all styles
- `assets/main.js`: all behavior (menu, filters, form, reveals)

## Already filled in

- Email: judahbrody@gmail.com (site-wide)
- Phone: (805) 886-5822
- Service area: Santa Barbara, Ventura, San Luis Obispo
- Instagram, LinkedIn, and X links (footers and schema)
- Proof strip: FAA Part 107, ASU Cronkite, NBA/MLB/CFB coverage, Hearst National
  Journalism Award finalist
- Testimonial: Jose Gallagher, Rip Current Sports
- Client names in the "Partners and clients" row (10 businesses, shown as text
  until you drop in logo files)
- "Featured in" row: 9 outlets (12News KPNX, The State Press, NFHS Network,
  Noozhawk, JEA Digital Media, AZPreps365, East Valley Tribune, VOICE Magazine,
  KEYT-3 News), shown as text until you add logos
- Work grid: 7 project titles and categories (5 video, 2 social); Photo and Web
  filter pills removed since there is no work in those categories yet
- About page: story updated, "why the group" note removed, recognition line filled

## Still to add before launch

Search the whole folder for `[` to find remaining placeholders. The big ones:

1. **Hero b-roll** (`index.html`): add `assets/hero.mp4` and `assets/hero.webm`,
   10 to 15 seconds, muted, under about 4MB, plus `assets/hero-poster.jpg` as the
   slow-connection still.
2. **Featured work** (`index.html`): three real flagship projects, each linking to
   its own case study page. These are the only bracketed slots left on the home page.
3. **Client logos** (`index.html`): put logo files in `assets/logos/`. Each name
   slot has a comment above it with the exact filename to use, for example
   `assets/logos/orens-automotive.svg`. Swap the text for an `<img>` when ready.
4. **Press logos** (`index.html`): optional. Add outlet logos to `assets/press/`
   using the filenames in the comments, then swap the text for an `<img>`.
5. **Work grid thumbnails and links** (`work.html`): each tile has a real title
   already. Add a thumbnail image to each and point each link at a case study or a
   lightbox to the video.
6. **Case studies**: duplicate `case-study.html` for each project. Fill the
   deliverable embed, context, problem, process, gear, and result. Use real numbers
   where they exist; where they do not, use concrete qualitative outcomes plus a real
   client quote. Never invent figures.
7. **About portrait** (`about.html`): add a real working photo.
8. **og-image**: add `assets/og-image.jpg` (1200x630) for link previews.
9. **Archive** (`archive.html`): now populated with 16 real pieces pulled from your
   sites and playlists (video, broadcast, photo, writing), reached from the "More: view
   the archive" button below the Work grid. Two photo tiles point at older gallery pages;
   swap them for real galleries when ready. LinkedIn could not be read automatically
   (login required), so add anything from there by hand. External links open in a new tab.

## Folder layout for your assets

```
assets/
  styles.css
  main.js
  hero.mp4          (you add)
  hero.webm         (you add)
  hero-poster.jpg   (you add)
  og-image.jpg      (you add)
  logos/            (you add client logo files here)
  press/            (you add press/outlet logo files here)
```

## The contact form needs a backend

Right now the form validates and shows a success message on the client, then falls
back to a `mailto:` to judahbrody@gmail.com. That is fine for a soft launch, but
messages are not stored or emailed to you server-side until you connect a handler.
Two easy options, no server required:

- **Formspree**: create a form, point the form action at your endpoint, and remove
  the client-only fallback in `assets/main.js`.
- **Netlify Forms**: add `netlify` and a hidden `form-name` field, host on Netlify, done.

A honeypot field named `company_website` is already in place to reduce spam. Keep it.

## Analytics

No tracker is installed. Add one snippet before `</head>` on every page when ready:
Plausible or Fathom (lighter, privacy-friendly) or GA4. Nothing is loaded until you
add it, so there is no cookie banner needed by default.

## Brand rules that are already enforced (keep them enforced as you edit)

- **Zero em dashes and zero en dashes.** Verified across all files. Use "to" for
  ranges and rewrite sentences rather than reaching for a dash.
- **No banned words**: elevate, unleash, unlock, seamless, cutting-edge, revolutionize,
  solutions, synergy. Verified absent.
- **No emoji in copy.** Verified absent.
- **One exclamation point on the whole site**, now in the client testimonial. If you
  add another somewhere, remove one.
- **No fabricated proof.** No invented metrics, clients, testimonials, or logos. Every
  proof element is either real or a clearly marked placeholder.
- **Two typefaces only**: Instrument Serif (display) and Hanken Grotesk (body).

## Accessibility and performance notes

- Respects `prefers-reduced-motion`: reveal animations and the hero video pause.
- The hero video also pauses on `Save-Data` connections.
- Mobile-first. Persistent quote bar appears on scroll on small screens.
- Keep new images optimized (WebP or AVIF where you can) so pages stay fast.
