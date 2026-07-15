# Deployment Guide — Going Live

## The short answer

Yes — drop the `guide` folder into the root of your `syntropyearth.com` GitHub repository, exactly as it is, then push. Netlify is already watching that repo (per your existing setup) and will redeploy automatically. No build step, no config changes, because this is plain HTML/CSS/JS like the rest of the site.

## Step 1 — Where exactly the folder goes

Confirmed against your actual repository (`syntropyearth/syntropyearth-site`): your root already holds `index.html` alongside folders like `about/`, `climate-access/`, `services/`, `thinking/`, plus `js/`, `images/`, `styles.css`, `netlify.toml` and `_redirects`. The Guide fits the same pattern exactly — add a `guide` folder at that same root level, alongside `about/`, `services/`, etc.:

```
your-repo/
├── index.html
├── styles.css
├── netlify.toml
├── about/
├── climate-access/
├── services/
├── thinking/
├── js/
├── images/
└── guide/                   ← this entire folder, dropped in as-is
    ├── index.html
    ├── glossary.html
    ├── regulations-library.html
    ├── role-guides/
    │   ├── index.html
    │   └── csr-manager.html
    └── templates-tools/
        ├── index.html
        ├── climate-health-materiality-tracker.html
        └── climate-health-materiality-tracker.xlsx
```

This resolves to `syntropyearth.com/guide/` once deployed, matching how `services/`, `thinking/`, and the rest already resolve to their own clean paths. I've now read your actual `netlify.toml` and `_redirects` — you're right, nothing in either touches `/guide/`. `netlify.toml` confirms `publish = "."` (the repo root), which is exactly what this guide already assumed, so no adjustment needed there. The only redirect rules present are canonical-domain ones (the Netlify subdomain and `www.` both forcing to `syntropyearth.com`) and a single `/services.html → /services` clean-URL rule — neither interacts with the Guide.

**Note on the assets folder:** every Guide page now links your real `/styles.css` directly and carries only a small supplementary stylesheet inline for the handful of components your site doesn't already have (glossary, pagination, comparison table, stats band). `assets/guide-supplement.css` is the reference copy of that inline block, kept for future edits — you don't need to upload the `assets/` folder for the site to work.

## Step 2 — Getting the folder into GitHub (two ways, pick one)

**Option A — GitHub's website, no terminal needed:**
1. Open your repository on github.com
2. Click **Add file → Upload files**
3. Drag the entire `guide` folder (not the zip — unzip it first) into the upload area. Modern GitHub preserves the folder structure when you drag a folder in, not just individual files.
4. Scroll down, write a commit message like "Add Syntropy Guide resource library", and click **Commit changes** directly to your main branch
5. Netlify picks up the push automatically and redeploys within a minute or two — check your Netlify dashboard for the deploy log if you want to watch it happen

**Option B — git command line, if you're comfortable with it:**
```bash
git clone <your-repo-url>
cd <your-repo-folder>
# unzip syntropy-guide.zip and copy the guide/ folder in here
git add guide/
git commit -m "Add Syntropy Guide resource library"
git push origin main
```

Either way, the moment it's pushed, Netlify handles the rest.

## Step 3 — Confirm it's actually live

Once the Netlify deploy finishes (check the dashboard, or just wait ~2 minutes), visit `syntropyearth.com/guide/` directly. Click through every internal link once — Home, Glossary, Regulations, Role Guides, Templates, the download button — to confirm nothing 404s. Static sites don't fail loudly; a broken link just quietly goes nowhere; it's worth the two minutes to check by hand.

## Step 4 — After it's live

- **Google Search Console**: add `syntropyearth.com/guide/` and its key sub-pages as URLs to request indexing, so Google crawls them sooner rather than waiting for its normal schedule
- **GA4 Realtime report**: open it and click around the Guide yourself — confirm `guide_section_view` and standard pageviews show up, so you know tracking survived the move intact
- **The download link**: download the tracker yourself once, live, and confirm both the file arrives correctly and `template_download` shows up in GA4 Realtime

## About the two other guide documents, plainly

**`nav-integration.md`** is about a different file than anything in this folder — it's about **your existing homepage**, the one already live at syntropyearth.com. I don't have that file's content in this conversation, so I can't write the exact nav edit myself. Two ways to fix that:
- Paste me the `<nav>...</nav>` block from your homepage's HTML directly in chat, or
- Give me the raw GitHub URL to that file (format: `https://raw.githubusercontent.com/your-username/your-repo/main/index.html`) — I can fetch that URL directly and write the precise nav insertion myself, matching your existing class names and spacing exactly

Either way gets you an exact drop-in edit instead of a generic snippet you have to adapt yourself.

**`analytics-and-gtm-setup.md`** doesn't require anything from you to work at the baseline level — the Guide pages already carry your live GA4 tag and will start counting the moment they're deployed. That file is only relevant when you're ready to do the GTM migration (moving tracking off hardcoded `gtag.js` and into Tag Manager, so future tracking changes don't require touching HTML again). Nothing in it blocks going live today.

## The one thing to decide before you push

Everything in this folder assumes the Guide lives at `/guide/`. If you'd rather it sit somewhere else — `/resources/`, `/knowledge-hub/`, whatever — every internal link across all seven pages needs the same path adjustment before deploy, not after. Confirm the path now; it's a five-minute find-and-replace on my end if you want it changed, versus a broken-link cleanup later if it ships wrong.
