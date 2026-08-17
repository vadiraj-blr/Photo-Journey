/**
 * Build-time prerender for AI/crawler visibility.
 *
 * Runs AFTER `vite build`. Reads the built index.html, pulls live content from
 * the API, and writes one real static HTML file per route into dist/public with
 * per-page <title>/meta/OG tags, readable body text, and JSON-LD.
 *
 * React (createRoot) clears #root on mount, so humans still get the SPA.
 * Crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot) get real text.
 *
 * Fail-soft by design: any error logs a warning and exits 0 so a hiccup in the
 * API can never break a production deploy.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SITE = process.env.PRERENDER_SITE_URL || "https://thewildpixels.com";
const API = process.env.PRERENDER_API_BASE || SITE;
const DIST = path.resolve(process.env.PRERENDER_DIST || "artifacts/wildpixels/dist/public");
const AUTHOR = "Vadiraj BK";

/* ---------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Markdown -> plain text, for meta descriptions. */
const plain = (s) =>
  String(s ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const clip = (s, n = 158) => {
  const t = plain(s);
  if (t.length <= n) return t;
  return t.slice(0, t.lastIndexOf(" ", n - 1)) + "…";
};

/** Minimal markdown -> HTML. Headings, lists, paragraphs. Enough to be read. */
function md(src) {
  if (!src) return "";
  const blocks = String(src).replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out = [];
  for (const raw of blocks) {
    const b = raw.trim();
    if (!b) continue;
    const h = b.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = Math.min(h[1].length + 1, 4);
      out.push(`<h${lvl}>${esc(plain(h[2]))}</h${lvl}>`);
      continue;
    }
    if (/^[-*+]\s/m.test(b)) {
      const items = b
        .split("\n")
        .filter((l) => /^[-*+]\s/.test(l.trim()))
        .map((l) => `<li>${esc(plain(l.replace(/^[-*+]\s/, "")))}</li>`);
      if (items.length) {
        out.push(`<ul>${items.join("")}</ul>`);
        continue;
      }
    }
    out.push(`<p>${esc(plain(b))}</p>`);
  }
  return out.join("\n");
}

async function api(pathname) {
  const url = `${API}${pathname}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

const monthYear = (t) => [t.month, t.year].filter(Boolean).join(" ");
const placeOf = (t) => [t.location, t.country].filter(Boolean).join(", ");

/* ------------------------------------------------------------ head + body */

function headFor(p) {
  const url = `${SITE}${p.path === "/" ? "" : p.path}`;
  const img = p.image || `${SITE}/opengraph.jpg`;
  const tags = [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<meta name="robots" content="${p.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="Wildpixels" />`,
    `<meta property="og:type" content="${p.ogType || "website"}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:alt" content="${esc(p.imageAlt || p.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ];
  if (p.jsonld) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(p.jsonld).replace(/</g, "\\u003c")}</script>`,
    );
  }
  return tags.join("\n    ");
}

const PRERENDER_CSS = `
#wld-prerender{max-width:44rem;margin:0 auto;padding:0 24px 96px;color:#d6d3d1;
font-family:"DM Sans",system-ui,sans-serif;font-size:16px;line-height:1.7}
#wld-prerender h1,#wld-prerender h2,#wld-prerender h3{font-family:"Playfair Display",Georgia,serif;
font-weight:400;color:#fafaf9;line-height:1.2;margin:2.5rem 0 1rem}
#wld-prerender h1{font-size:2.25rem}#wld-prerender h2{font-size:1.6rem}#wld-prerender h3{font-size:1.2rem}
#wld-prerender a{color:#d6d3d1}#wld-prerender img{max-width:100%;height:auto;display:block;margin:1.5rem 0 .5rem}
#wld-prerender figcaption{font-size:13px;color:#a8a29e;margin-bottom:2rem}
#wld-prerender .wld-meta{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a8a29e}
#wld-prerender article{border-top:1px solid #292524;padding-top:1rem;margin-top:2.5rem}
`.trim();

function render(tpl, p) {
  let html = tpl;

  // Strip the template's homepage-only SEO tags.
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
  html = html.replace(
    /<meta\s[^>]*?(?:name|property)=["'](?:description|robots|og:[^"']*|twitter:[^"']*)["'][^>]*>\s*/gi,
    "",
  );
  html = html.replace(/<link\s[^>]*?rel=["']canonical["'][^>]*>\s*/gi, "");

  // Inject fresh per-page head.
  html = html.replace(
    /<\/head>/i,
    `  ${headFor(p)}\n    <style id="wld-prerender-css">${PRERENDER_CSS}</style>\n  </head>`,
  );

  // Inject crawler-readable body inside #root, below the hero shell.
  html = html.replace(
    /<div id="wld-prerender">\s*<\/div>/i,
    `<div id="wld-prerender"><!--wld:s-->\n${p.body}\n<!--wld:e--></div>`,
  );

  return html;
}

/** Make the script safe to re-run over an already-prerendered dist. */
function normalise(tpl) {
  return tpl
    .replace(/<!--wld:s-->[\s\S]*?<!--wld:e-->/g, "")
    .replace(/<style id="wld-prerender-css">[\s\S]*?<\/style>\s*/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
}

/* ----------------------------------------------------------------- routes */

function homePage(trips, notes, settings) {
  const stats = `${new Set(trips.map((t) => t.location)).size} locations · ${trips.reduce((n, t) => n + (t.photoCount || 0), 0)} captures`;
  const body = [
    `<h1>Wild through my lens</h1>`,
    `<p class="wld-meta">${esc(stats)}</p>`,
    `<p>Wildlife and nature photography from across India by ${esc(AUTHOR)} — national parks, tiger reserves, mangrove deltas, deserts and high Himalaya. Every expedition below has a field story and a full gallery.</p>`,
    `<h2>Expeditions</h2>`,
    ...trips.map((t) =>
      [
        `<article>`,
        `<h3><a href="/trips/${t.id}">${esc(t.title)}</a></h3>`,
        `<p class="wld-meta">${esc(placeOf(t))}${t.month || t.year ? ` — ${esc(monthYear(t))}` : ""}${t.photoCount ? ` — ${t.photoCount} photographs` : ""}</p>`,
        t.storySummary || t.story ? `<p>${esc(clip(t.storySummary || t.story, 320))}</p>` : "",
        `</article>`,
      ].join("\n"),
    ),
    notes.length
      ? `<h2>Field notes</h2>\n<ul>${notes.map((n) => `<li><a href="/field-notes/${esc(n.slug)}">${esc(n.title)}</a> — ${esc(clip(n.excerpt, 140))}</li>`).join("")}</ul>`
      : "",
    `<h2>About</h2><p>${esc(clip(settings?.aboutBio || "", 400))}</p>`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    path: "/",
    title: `Wildpixels — India Wildlife Photography by ${AUTHOR}`,
    description: `Wildlife and nature photography across India by ${AUTHOR}. ${stats}, with field stories from every expedition.`,
    image: `${SITE}/opengraph.jpg`,
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Wildpixels",
      url: SITE,
      description: `Wildlife and nature photography across India by ${AUTHOR}.`,
      author: { "@type": "Person", name: AUTHOR, url: `${SITE}/about` },
    },
  };
}

function aboutPage(settings) {
  const bio = settings?.aboutBio || "";
  const contact = [
    settings?.contactLocation && `Based in ${settings.contactLocation}.`,
    settings?.contactEmail && `Email: ${settings.contactEmail}.`,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    path: "/about",
    title: `About ${AUTHOR} — Wildlife Photographer | Wildpixels`,
    description: clip(bio) || `About ${AUTHOR}, wildlife and nature photographer based in India.`,
    image: settings?.aboutPortraitUrl || `${SITE}/opengraph.jpg`,
    imageAlt: `${AUTHOR}, wildlife photographer`,
    ogType: "profile",
    body: [
      `<h1>${esc(settings?.aboutTitle || `About ${AUTHOR}`)}</h1>`,
      md(bio),
      contact ? `<h2>Contact</h2><p>${esc(contact)}</p>` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    jsonld: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: AUTHOR,
      jobTitle: "Wildlife and Nature Photographer",
      url: `${SITE}/about`,
      description: clip(bio, 300),
      ...(settings?.contactLocation
        ? { address: { "@type": "PostalAddress", addressLocality: settings.contactLocation } }
        : {}),
    },
  };
}

function tripPage(t) {
  const place = placeOf(t);
  const when = monthYear(t);
  const gallery = (t.galleryPhotoUrls || []).slice(0, 60);
  const body = [
    `<h1>${esc(t.title)}</h1>`,
    `<p class="wld-meta">${esc(place)}${when ? ` — ${esc(when)}` : ""}${t.photoCount ? ` — ${t.photoCount} photographs` : ""}</p>`,
    t.storySummary ? `<p><strong>${esc(plain(t.storySummary))}</strong></p>` : "",
    md(t.story),
    t.travelTips ? `<h2>Travel notes</h2>\n${md(t.travelTips)}` : "",
    (t.tags || []).length ? `<p class="wld-meta">Subjects: ${esc((t.tags || []).join(", "))}</p>` : "",
    gallery.length
      ? `<h2>Gallery</h2>\n` +
        gallery
          .map((g) => {
            const alt = g.caption ? `${plain(g.caption)} — ${place}` : `${t.title} — ${place}`;
            return `<figure><img src="${esc(g.url)}" alt="${esc(alt)}" loading="lazy" width="1200" height="800" />${g.caption ? `<figcaption>${esc(plain(g.caption))}</figcaption>` : ""}</figure>`;
          })
          .join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    path: `/trips/${t.id}`,
    title: `${t.title} — ${place}${when ? `, ${when}` : ""} | Wildpixels`,
    description:
      clip(t.storySummary || t.story) ||
      `${t.photoCount || ""} wildlife photographs from ${place}${when ? ` in ${when}` : ""} by ${AUTHOR}.`,
    image: t.coverImageUrl,
    imageAlt: `${t.title} — ${place}`,
    ogType: "article",
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: t.title,
      url: `${SITE}/trips/${t.id}`,
      description: clip(t.storySummary || t.story, 300),
      author: { "@type": "Person", name: AUTHOR, url: `${SITE}/about` },
      contentLocation: { "@type": "Place", name: place },
      keywords: (t.tags || []).join(", ") || undefined,
      image: gallery.slice(0, 12).map((g) => ({
        "@type": "ImageObject",
        contentUrl: g.url,
        caption: plain(g.caption) || `${t.title} — ${place}`,
        creator: { "@type": "Person", name: AUTHOR },
        creditText: "Wildpixels",
        copyrightNotice: `© ${AUTHOR}`,
      })),
    },
  };
}

function notePage(a) {
  const body = [
    `<h1>${esc(a.title)}</h1>`,
    a.created_at
      ? `<p class="wld-meta">Field note — ${esc(new Date(a.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }))}</p>`
      : "",
    a.excerpt ? `<p><strong>${esc(plain(a.excerpt))}</strong></p>` : "",
    md(a.content || a.body || ""),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    path: `/field-notes/${a.slug}`,
    title: `${a.title} | Field Notes — Wildpixels`,
    description: clip(a.excerpt || a.content),
    image: a.cover_image_url,
    imageAlt: a.title,
    ogType: "article",
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      url: `${SITE}/field-notes/${a.slug}`,
      description: clip(a.excerpt || a.content, 300),
      datePublished: a.created_at || undefined,
      dateModified: a.updated_at || a.created_at || undefined,
      author: { "@type": "Person", name: AUTHOR, url: `${SITE}/about` },
      publisher: { "@type": "Organization", name: "Wildpixels", url: SITE },
      ...(a.cover_image_url ? { image: a.cover_image_url } : {}),
    },
  };
}

/* -------------------------------------------------------------- side files */

async function writeSideFiles(pages) {
  const now = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) =>
        `  <url><loc>${SITE}${p.path === "/" ? "/" : p.path}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${p.path === "/" ? "1.0" : "0.8"}</priority></url>`,
    )
    .join("\n");

  await writeFile(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );

  const bots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Googlebot",
    "Bingbot",
    "Applebot",
    "Applebot-Extended",
    "meta-externalagent",
    "Amazonbot",
    "cohere-ai",
    "YouBot",
    "DuckAssistBot",
  ];
  await writeFile(
    path.join(DIST, "robots.txt"),
    [
      ...bots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin\n`),
      `User-agent: *\nAllow: /\nDisallow: /admin\n`,
      `Sitemap: ${SITE}/sitemap.xml`,
      "",
    ].join("\n"),
  );

  await writeFile(
    path.join(DIST, "llms.txt"),
    [
      `# Wildpixels`,
      ``,
      `> Wildlife and nature photography from across India by ${AUTHOR}. Expedition galleries with field stories from national parks, tiger reserves, mangrove deltas, deserts and the Himalaya.`,
      ``,
      `## Expeditions`,
      ...pages
        .filter((p) => p.path.startsWith("/trips/"))
        .map((p) => `- [${p.title.split(" | ")[0]}](${SITE}${p.path}): ${p.description}`),
      ``,
      `## Field notes`,
      ...pages
        .filter((p) => p.path.startsWith("/field-notes/"))
        .map((p) => `- [${p.title.split(" | ")[0]}](${SITE}${p.path}): ${p.description}`),
      ``,
      `## About`,
      `- [About ${AUTHOR}](${SITE}/about)`,
      ``,
    ].join("\n"),
  );
}

/* -------------------------------------------------------------------- main */

async function main() {
  const tplPath = path.join(DIST, "index.html");
  const tpl = normalise(await readFile(tplPath, "utf8"));

  if (!/<div id="wld-prerender">\s*<\/div>/i.test(tpl)) {
    console.warn('[prerender] index.html is missing <div id="wld-prerender"></div> — skipping.');
    return;
  }

  const [trips, notes, settings] = await Promise.all([
    api("/api/trips").catch((e) => (console.warn("[prerender] trips:", e.message), [])),
    api("/api/articles").catch((e) => (console.warn("[prerender] articles:", e.message), [])),
    api("/api/settings").catch((e) => (console.warn("[prerender] settings:", e.message), null)),
  ]);

  const fullNotes = await Promise.all(
    (notes || []).map((n) => api(`/api/articles/${n.slug}`).catch(() => n)),
  );

  const pages = [
    homePage(trips || [], notes || [], settings),
    aboutPage(settings),
    ...(trips || []).map(tripPage),
    ...fullNotes.map(notePage),
  ];

  for (const p of pages) {
    const dir = p.path === "/" ? DIST : path.join(DIST, p.path);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), render(tpl, p));
  }

  await writeSideFiles(pages);
  console.log(`[prerender] wrote ${pages.length} pages + sitemap.xml, robots.txt, llms.txt`);
}

main().catch((err) => {
  console.warn("[prerender] skipped:", err?.message || err);
  process.exit(0);
});
