# Syntropy Guide — full folder, fourth pass

Read in this order:

1. `syntropy-guide-strategy-and-roadmap.md` — Section 9's changelog is the fastest way to see everything that changed in this pass
2. `deployment-guide.md` — Step 0 covers the four real-site files, Steps 1-4 cover the Guide folder itself
3. `analytics-and-gtm-setup.md` — corrected against your actual GTM setup (it was already live; my earlier draft assumed it wasn't)
4. `nav-integration.md` — resolved, kept for the record

Two things get deployed together but are separate:

- **`syntropy-guide/`** (this whole folder) → goes into your repo root as `guide/`
- **`real-site-updates/`** (delivered alongside, not nested inside) → four files that replace existing ones elsewhere in your repo (homepage, services, thinking, about)

Everything is self-contained HTML with your real `/styles.css` linked in — open any `.html` file in a browser locally and it'll look unstyled (same reason as last time: absolute paths need a real server or real deployment), but it'll render correctly once it's live at `syntropyearth.com`.
