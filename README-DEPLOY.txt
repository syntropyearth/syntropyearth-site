SYNTROPY EARTH -- v2 DEPLOY, 29 August 2026
===========================================

WHAT TO DO
----------
Drop the contents of this folder into your repo root, keeping the folder
structure exactly as it is. Overwrite when prompted. Commit. Push.
Netlify rebuilds automatically.

Do NOT copy the folder itself. Copy what is INSIDE it, so that
index.html lands next to your existing index.html.

Delete this README-DEPLOY.txt afterwards -- it should not be committed.

NO MANUAL STEPS. styles.css here is the COMPLETE file with everything
already merged. Do not append anything to it.

ANALYTICS -- UNCHANGED
----------------------
GTM-WG7CWTHG stays in Netlify Snippet Injection. It is deliberately not
in any of these files. gtag.js is not loaded. Click attribution still
runs through dataLayer via data-cavs / data-newsletter in js/main.js.
Nothing about tracking changes. No GTM container edits needed.

WHAT CHANGED
------------
1. Climate Clock band on the homepage, directly under the menu.
   Script: https://api.climateclock.world/assets/widget-v2.js
   (NOT climateclock.world/widget-v2.js -- that URL does not resolve,
   which is why it appeared broken before.)

2. All pages bumped to ?v=253. styles.css carries a one-year immutable
   cache header, so the version string is what forces browsers to fetch
   the new CSS. Every page had to move together.

3. Sitewide nav and footer: the Guide tree, privacy, 404 and all five
   article pages now carry the same nav (Social Impact, Brand & Growth,
   Resources dropdown, About dropdown) and the same footer as the
   v2 pages. "Services" is gone from every menu.

4. /services/ redirect forced with 301! in _redirects. A plain 301 was
   being ignored because services/index.html still exists on disk and
   shadowed it.

5. Thinking index rebuilt with all five articles, newest first.

6. sitemap.xml expanded to 27 URLs including both newer articles and
   the full Guide tree.

AFTER DEPLOY
------------
- Hard-refresh the homepage. The clock should render as a black bar with
  a red DEADLINE counter and a blue LIFELINE figure.
- Check the homepage on your phone. The widget controls its own
  responsive behaviour inside the band; this is the one thing that could
  not be verified before shipping.
- Confirm /services/ now redirects to /social-impact/.
- Google Search Console: resubmit https://syntropyearth.com/sitemap.xml
  and request indexing for /social-impact/ and /brand-growth/.

TWO THINGS TO CONSIDER SEPARATELY
---------------------------------
- The clock is a live dependency on api.climateclock.world. If that host
  is down you get a black gap above your hero. To remove the risk: build
  widget-v2.js from the climateclock repo, put it in /js/, and change the
  script src in index.html to /js/widget-v2.js.
- styles-append.css and NAV-FOOTER-SWAP-KIT.html are still committed at
  your repo root and are publicly downloadable. Nothing references them
  any more. Safe to delete. services/ can also go whenever you like --
  the forced redirect protects the URL either way.
