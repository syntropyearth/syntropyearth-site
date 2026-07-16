# Analytics & GTM, Corrected Against the Real Setup

This whole document changed from the earlier version. Your real page source (from `thinking-index.html`, `about-index.html`, `services-index.html`) showed a single comment on every page:

```html
<!-- Analytics managed via GTM-WG7CWTHG (injected by Netlify Snippet Injection) -->
```

That means GTM is **already live**, container `GTM-WG7CWTHG`, injected automatically into every page's `<head>` by a Netlify Snippet Injection rule in your site settings, not something added per-page in the HTML. My earlier draft of this document assumed GTM hadn't been set up yet and walked you through installing it manually. That assumption was wrong, and everything Guide-related has now been corrected to match reality:

- Every Guide page's fake hardcoded `gtag.js` block is removed
- Every Guide page now carries the same one-line comment your real pages use, for consistency (Netlify's snippet injection applies to every page on the domain regardless of what's in that page's own source, so this comment is documentation, not functional code, but keeping it consistent matters if anyone reads the source later)
- The custom `guide_section_view` and `template_download` events now push directly to `window.dataLayer`, which is the correct pattern for GTM (there is no `gtag()` function loaded on this site, since GTM isn't using the gtag.js library)

## What this means for tracking

Because GTM is already live sitewide, no setup is required for baseline tracking, pageviews across every Guide page start counting the moment the folder is deployed. Nothing needs to be done to activate this.

## Confirming your GTM tags actually capture what you want

You'll need to check your GTM container (tagmanager.google.com, container `GTM-WG7CWTHG`) for two things:

1. **Is a GA4 Configuration tag set up, firing on All Pages?** If yes, standard pageviews, plus the two custom events below, will show in your GA4 property automatically. If you're not sure, this is worth a five-minute check in the GTM interface rather than guessing.
2. **File download tracking**, GA4 tracks file downloads (like the materiality tracker's `.xlsx`) automatically through Enhanced Measurement, independent of GTM, as long as it's toggled on in your GA4 property (Admin → Data Streams → your web stream → Enhanced Measurement → File downloads). This has nothing to do with GTM and doesn't need any code.

## The two custom events already wired into the Guide

- **`guide_section_view`**, fires once when someone lands on `/guide/`, pushed via `window.dataLayer.push({...})`. To see this in GA4, you'll need a GTM trigger listening for this custom event name, connected to a GA4 Event tag. If that trigger doesn't exist yet in your GTM container, the event pushes to the dataLayer but nothing captures it downstream, worth checking.
- **`template_download`**, fires when the materiality tracker's download button is clicked, same dataLayer pattern, with `template_name` and `file_type` parameters.

If you want these two events actually flowing into GA4 rather than just sitting in the dataLayer unclaimed, that's a GTM configuration task (add a Custom Event trigger for each event name, wire it to a GA4 Event tag), not a code task. Happy to walk through the exact GTM click-path if you want, once you've had a look at what's already configured in the container.

## What I can't verify from here

I don't have access to your actual GTM container contents, only the fact that it's installed and its ID. Everything above about "check whether X tag exists" is genuinely something only you (or whoever set up `GTM-WG7CWTHG`) can confirm by opening the container.
