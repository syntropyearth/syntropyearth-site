# Syntropy Earth — Deploy &amp; Verify Guide
## Getting the site live on Netlify and indexed by Google

This is written for someone deploying for the first time. Follow it top to bottom. Total time to live: about 30 minutes. Allow up to 48 hours for Google to start indexing.

---

## Before you start: three things to swap in

Open these files and replace the placeholders. Search for the text in capitals.

1. **Google Analytics ID.** In `index.html`, `services/index.html`, `about/index.html`, `thinking/index.html`, and the article file, find `G-XXXXXXXXXX` and replace it with your real GA4 Measurement ID (you create that in step 6). It appears twice per page. Quick way: do all pages at once with find-and-replace in your code editor across the whole folder.

2. **Booking link.** In `index.html`, find `https://calendar.app.google/REPLACE-WITH-YOUR-LINK` and replace it with your Google Calendar appointment-scheduling link (how to create it is at the bottom).

3. **Email address.** Every page uses `hello@syntropyearth.com`. If you want a different address on your Google Workspace, find-and-replace it across the folder. Set the address up as a real inbox or alias before launch so messages arrive.

> Tip: a free code editor like VS Code lets you search-and-replace across the whole folder in one action (Edit menu, "Replace in Files"). That handles the GA ID on every page at once.

---

## Step 1 — Put the files on GitHub

1. Sign in to the GitHub account linked to your Google Workspace.
2. Create a new repository. Name it `syntropy-earth` (or anything). Keep it private if you prefer; Netlify can still read it.
3. Upload the entire contents of the `syntropyearth` folder to the repository. The simplest way: on the new empty repo page, click "uploading an existing file" and drag in everything inside the folder (not the folder itself, its contents: `index.html`, `styles.css`, the `js`, `services`, `about`, `thinking` folders, and the rest).
4. Commit. Your files are now on GitHub.

---

## Step 2 — Connect Netlify to the repo

1. Sign in to Netlify with the same Google Workspace account.
2. Click "Add new site" then "Import an existing project."
3. Choose GitHub, authorise it, and pick your `syntropy-earth` repository.
4. Build settings: leave the build command **empty**. Set the publish directory to `.` (a single dot, meaning the root). This site has no build step, it is plain files.
5. Click "Deploy." In under a minute you will get a live URL like `random-name.netlify.app`. Open it. The site is live.

The `netlify.toml` file already in the project sets clean URLs, caching, and security headers automatically. You do not need to configure anything.

---

## Step 3 — Point your domain at it

1. In Netlify, go to your site, then "Domain management" then "Add a custom domain." Enter `syntropyearth.com`.
2. Netlify will show you DNS records to set. You have two options:
   - **Easiest:** use Netlify DNS. Netlify gives you four nameservers. Go to wherever you bought syntropyearth.com, find the nameserver settings, and replace the existing nameservers with Netlify's four. This hands DNS to Netlify and everything else is automatic.
   - **Or keep your current DNS:** add the A record and CNAME that Netlify specifies at your domain registrar.
3. Netlify provisions a free SSL certificate automatically once DNS resolves. Wait for it to show "HTTPS enabled" (usually under an hour, sometimes up to a day).
4. Turn on "Force HTTPS" in Netlify so every visitor lands on the secure version.

Once this resolves, `https://syntropyearth.com` shows your site.

---

## Step 4 — Set up Google Search Console

This is how Google learns your site exists. Do not skip it.

1. Go to search.google.com/search-console and sign in with your Google Workspace account.
2. Add a property. Choose "Domain" (not URL prefix). Enter `syntropyearth.com`.
3. Google gives you a TXT record to add to your DNS. Add it wherever your DNS lives (Netlify DNS, or your registrar). Verify.
4. Once verified, go to "Sitemaps" in the left menu and submit: `sitemap.xml`
5. That tells Google about all five live pages at once.

In the first few days, use "URL Inspection" to manually request indexing for your homepage and the article. It nudges Google to crawl sooner.

---

## Step 5 — Confirm it is being indexed

After a day or two, search Google for `site:syntropyearth.com`. As pages get indexed they will start appearing. New domains take time, this is normal. Search Console's "Pages" report shows exactly what is indexed and flags any problems.

---

## Step 6 — Google Analytics 4

1. Go to analytics.google.com, sign in with the Workspace account.
2. Create an account and a property for Syntropy Earth. Choose "Web" as the platform, enter `syntropyearth.com`.
3. It gives you a Measurement ID that looks like `G-ABC123XYZ`.
4. That is the value you put in place of `G-XXXXXXXXXX` in step "Before you start." If you have not done the swap yet, do it now, commit to GitHub, and Netlify will redeploy automatically within a minute.
5. Back in Analytics, use the "Realtime" report and open your own site to confirm data is flowing.

---

## Step 7 — Check it before you tell anyone

Run these quick checks:

- **Mobile:** open the live site on your phone. Check the menu opens, the sections read well, nothing overflows sideways.
- **Page speed:** run the homepage URL through pagespeed.web.dev. Aim for green on mobile. This site is built light, so it should score well.
- **Rich results:** run the homepage and the article through search.google.com/test/rich-results to confirm the schema is valid.
- **Social preview:** paste your homepage URL into the LinkedIn Post composer (don't post, just paste) to see the link preview. If the image is missing, that is the `og-image.png` (see the image brief). Text will still show.
- **Links:** click through every nav item, footer link, and CTA. Confirm the booking link opens your calendar and the email link opens a compose window.

---

## When you publish a new article later

The article at `thinking/india-heat-season-healthcare-operations/` is your template. To add a post:

1. Duplicate that folder, rename it to your new slug (lowercase, hyphenated, keyword-aligned).
2. Replace the title, meta description, canonical URL, headline, body, TL;DR, FAQ, and the two schema blocks (BlogPosting and FAQPage) with the new content.
3. Add the new URL to `sitemap.xml`.
4. Add a real linked card for it on `thinking/index.html` and, if you want, swap one of the "In progress" cards on the homepage.
5. Commit to GitHub. Netlify redeploys automatically. Resubmit the sitemap in Search Console.

---

## Creating the Google Meet booking link

1. Open Google Calendar on the Workspace account.
2. Click "Create" then "Appointment schedule."
3. Set your availability, the meeting length, and that it should be a Google Meet video call.
4. Save, then copy the public booking page link.
5. That link replaces `https://calendar.app.google/REPLACE-WITH-YOUR-LINK` in `index.html`.

---

## What is still outstanding (not blockers for launch)

- **Founder photo:** drop your photo into a new `images` folder as `abhijith-magal.jpg`, then in `index.html` follow the one-line comment in the Founder section to swap the placeholder for the real image. Same optional swap can go on the About page.
- **og-image.png:** the 1200x630 social-share image (see the image brief). Until it exists, link previews show text only, which is fine for launch.
- **The other two articles and the cornerstone piece:** these are content-writing passes, covered in the image brief and the SEO foundation doc.

---

*You can launch the moment steps 1 through 4 are done. Everything after sharpens it.*
