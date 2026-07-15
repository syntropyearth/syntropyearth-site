# Analytics & GTM Setup — Syntropy Guide

## What's already wired into every Guide page

Every page in this folder now carries the same GA4 snippet already live sitewide (`G-SRYX1DSMRX`), so as soon as this folder is part of syntropyearth.com, standard pageviews on every Guide page start counting immediately — no extra setup needed for that baseline.

On top of the default `page_view` event, two custom events are already built in:

- **`guide_section_view`** — fires once when someone lands on the Guide hub (`index.html`). Filter by this event name in GA4 to get a direct count of hub landings, rather than filtering page paths.
- **`template_download`** — fires when someone clicks the materiality tracker's download button, with `template_name` and `file_type` parameters. This is in addition to GA4's automatic `file_download` event (see below), so you can look up downloads either by this event or by filename.

## Step 1 — Confirm Enhanced Measurement is on (5 minutes, does most of the work)

GA4 properties track file downloads automatically through **Enhanced Measurement**, on by default unless someone switched it off:

1. GA4 → Admin → Data Streams → select the web stream for syntropyearth.com
2. Open "Enhanced measurement" → confirm **File downloads** is toggled on
3. That's it. Any click on a link ending in `.xlsx`, `.pdf`, `.doc`, `.zip` etc. now logs a `file_download` event automatically, with `file_name`, `file_extension`, and `link_url` as parameters — no code required, and it will pick up every future template you add without touching the site again.

## Step 2 — Reading the numbers

GA4 → Reports → Engagement → Events:

- **`guide_section_view`** → count of Guide hub landings
- **`file_download`** or **`template_download`** → filter by `file_name` or `template_name` to see downloads per asset
- **Page path** → `/guide/` and below, standard pageview breakdown by URL, if you want the full page-by-page picture rather than just the named events

For a persistent dashboard instead of digging through the Events report each time, GA4's free "Explore" tab can build a table of event name x count x trend with about five clicks, or you can pull the same into a free Looker Studio report connected directly to your GA4 property — no extra credentials, no Sheets pipeline needed for this part.

## Step 3 — Setting up Google Tag Manager (the pending item)

You don't strictly need GTM to get the tracking above — it's already running through the hardcoded GA4 snippet. GTM is worth setting up because it lets you add or change tracking (new events, new pixels, scroll-depth tracking) without touching site code again. Here's the setup, start to finish:

1. Go to [tagmanager.google.com](https://tagmanager.google.com), create an account (name it "Syntropy Earth") and a container (name it "syntropyearth.com", platform: Web)
2. GTM gives you two code blocks — one for `<head>`, one right after `<body>`. Every HTML file across **both** sites needs both blocks (this is a sitewide change, not Guide-only)
3. In GTM, create a new Tag → type "Google Analytics: GA4 Configuration" → Measurement ID `G-SRYX1DSMRX` → Trigger: "All Pages" → save and name it something findable like "GA4 – Base Config"
4. Publish the container (top-right "Submit" button in GTM)
5. **Once the GTM tags are live and verified working** (use GTM's Preview mode against the live site before publishing), remove the hardcoded `gtag.js` snippet from every page — including the ones in this folder — so GA4 isn't double-counting every pageview through two separate code paths
6. In each Guide page's `<head>`, there's already a commented-out GTM block sitting directly under the gtag.js snippet, with `GTM-XXXXXXX` as a placeholder. Swap that for your real container ID, uncomment it, and repeat for the `<body>` noscript block

Do this as one clean pass across the whole site, not just the Guide folder — partial migration is how double-counting bugs happen.

### Recreating the two custom events in GTM (optional upgrade, once GTM is live)

Once GTM is running the GA4 tag, `guide_section_view` and `template_download` can move from hardcoded `gtag()` calls into GTM triggers instead — a Click trigger on the download button's CSS class, and a Page View trigger scoped to the hub URL. Not necessary to do immediately; the hardcoded version works fine standalone and can keep running until you're ready to move it.

## What this setup gets you, concretely

- A running count of hub landings, distinct from total site traffic
- A per-asset download count as the template library grows, with zero extra code needed for each new file
- A single place (GTM) to add future tracking — a newsletter signup, a workshop RSVP click, scroll depth on the longer role guides — without editing HTML again once it's live
