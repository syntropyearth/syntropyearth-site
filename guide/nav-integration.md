# Homepage navigation — done, not a request anymore

I pulled your actual repository (`syntropyearth/syntropyearth-site`) and read `index.html` directly, so this is no longer something I need from you — it's already built into every Guide page.

## What I found

Your real header uses `.nav` / `.nav-inner` / `.nav-brand` / `.nav-links`, an inline SVG logo mark (not an image file), and a separate `.mobile-menu` block toggled by a hamburger button — structurally nothing like my first guess. Your real routes are clean, folder-based paths: `/services`, `/thinking`, `/about`, `/climate-access`, with `/#contact` as the CTA anchor on the homepage. Every one of those is a folder in your repo (`services/`, `thinking/`, `about/`, `climate-access/`) containing its own `index.html` — exactly the pattern the Guide already uses, so `/guide/` slots in natively.

## What I changed

Every Guide page's header and footer is now your actual markup, copied directly from your live `index.html` — same classes, same inline SVG mark, same structure — with one link added: **Guide**, inserted between Thinking and About in both the desktop nav and the mobile menu, and again in the footer's Navigate column. Every internal Guide link is now an absolute path (`/guide/glossary.html`, not `glossary.html`), matching how your own site links between sections.

## The one real gap left

I don't have your actual `styles.css`, so I can't confirm the Guide's fonts, spacing and colours pixel-match yours — I've built them from the documented brand tokens in your style guide, which should be very close, but "very close" isn't "identical." If you want that gap fully closed, paste `styles.css` content here, or give me a URL to it that I can fetch directly (a `raw.githubusercontent.com` link works, a `github.com/.../blob/...` link works — a bare `github.com/user/repo` link doesn't let me reach individual files reliably, as this round showed).

While you're at it, `netlify.toml` and `_redirects` are both in your repo and I haven't seen either — if either one sets a custom publish directory or has redirect rules, that could affect where `/guide/` actually resolves once deployed. Worth a look before you push.
