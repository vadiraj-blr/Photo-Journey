---
name: Instagram-safe slide layout for fixed 16:9 decks
description: Technique for making a slide deck (fixed 1920x1080 canvas, platform contract) safe to crop into square/portrait Instagram posts.
---

The slides artifact platform contract fixes the canvas at 1920×1080 (16:9) in `App.tsx`'s `AllSlides` component — this cannot be resized per-deck.

**Why:** when a deck is meant to be posted daily to Instagram (which crops to square or 4:5), any content sitting near the left/right edges of a 16:9 frame gets cut off.

**How to apply:** build one shared slide template component where all text (kicker, headline, subtext, page counter) is horizontally centered and width-capped (e.g. `maxWidth: 46vw`, `left: 50%, transform: translateX(-50%)`), so it always falls inside the center ~1080px-wide square-safe zone of the 1920-wide canvas. Let background imagery bleed full-width (it's fine to lose the sides on a square crop). Reusing one template component across every slide also guarantees consistent formatting, which is a common secondary ask when building teaser/countdown decks.
