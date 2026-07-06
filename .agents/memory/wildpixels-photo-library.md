---
name: Wildpixels real photo library
description: Where to find real (non-AI-generated) Wildpixels wildlife photos to reuse across slide decks/artifacts.
---

Wildpixels has no central photo asset library in this repo — real photos are direct Google Photos share links (`https://lh3.googleusercontent.com/pw/<id>=w<width>`) embedded inline in existing slide/page components, not stored as local files.

**Why:** the site's photo pipeline scrapes public Google Photos albums server-side (see `artifacts/api-server/src/routes/trips.ts`) and the `photos` DB table just stores `imageUrl` + `caption`; individual slide decks historically copy specific URLs straight into JSX rather than referencing a shared constant/manifest.

**How to apply:** when a new artifact (e.g. a promo/countdown deck) needs "real" Wildpixels photography instead of AI-generated placeholders, grep existing slide files (`artifacts/wildpixels-slides/src/pages/slides/*.tsx`) for `googleusercontent.com` — they contain accurate `alt`/label text identifying the subject and location (e.g. Ranthambore tiger, Gir lion, Kaziranga rhino, Daroji sloth bear, Kabini, Hampi, Himalayan Monal, Valparai macaque, Bharatpur birds, snow leopard). Reuse the same URL (swap `=wNNNN` suffix for resolution) rather than re-uploading or generating new images. Double-check the alt text against the actual rendered image before trusting it verbatim — at least one label in the source deck (`Slide17Hampi` / Daroji bear photo) was reused across two different location captions.
