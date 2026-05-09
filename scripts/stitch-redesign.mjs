/**
 * Curl IQ — Stitch UI Redesign Script
 *
 * Generates premium, fully-animated redesigns of all Curl IQ pages
 * using @google/stitch-sdk and saves the HTML to stitch-output/.
 *
 * Usage:
 *   node --env-file=.env.local scripts/stitch-redesign.mjs
 *
 * Requirements:
 *   STITCH_API_KEY must be set in .env.local
 */

import { Stitch, StitchToolClient } from '@google/stitch-sdk';
import { writeFile, mkdir, access } from 'fs/promises';

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function withRetry(label, fn, retries = 3, delayMs = 4000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  Retry ${attempt}/${retries - 1} for ${label} (${err.message})...`);
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

// ─── Design System ────────────────────────────────────────────────────────────

const DESIGN_SYSTEM = `
Design system: "Midnight Botanical" — cinematic, premium mobile app (like a luxury iOS app)
- Mobile-first, 430px max-width, safe-area insets for notched iPhones
- Background: deep near-black #0C0906, layered surfaces #1A110A → #2D2114
- Primary accent: warm copper/rust #D4895C | hover/active: #B86F42
- Secondary accent: burnished gold #C8963C
- Positive metric: sage green #7EA985 | Error: deep red #C0392B
- Text: warm cream #F0E6D8 | Secondary text: #A08060 | Tertiary: #7A5C40
- Typography: Cormorant Garamond (display headings, 34px page title, 22px subheadings), DM Sans (body/UI, 17px buttons)
- Border radius: 20–24px on cards, 100px on buttons/chips | Borders: 1px rgba(255,255,255,0.07)
- Glassmorphism: background rgba(255,255,255,0.04) + backdrop-filter blur(24px) on cards, bottom nav, overlays
- Subtle grain/noise texture overlay on all dark backgrounds (CSS noise filter or SVG feTurbulence)
- Fixed bottom navigation bar: 4 tabs — Home, History, Scan (elevated copper pill button), Products
  Bottom nav uses glassmorphic blur, safe-area padding, subtle top border
- Two floating radial gradient orbs in the background: copper + gold, slow breathing animation (scale 1→1.08→1, 6s ease-in-out infinite alternate)

ALL animations must feel cinematic, intentional, and premium — nothing abrupt or jarring:
  • Page load: staggered fade-up entrance — each element slides up 12px + fades in, 60ms stagger between items, cubic-bezier(0.16,1,0.3,1)
  • Buttons: spring scale-down on tap (transform: scale(0.94)), subtle copper glow pulse on idle CTA (box-shadow animation)
  • Cards: hover lift (translateY -3px + shadow intensify), smooth 0.3s ease
  • Number/score counters: count-up from 0 on mount using JS requestAnimationFrame
  • Charts: line traces from left to right on mount (stroke-dasharray / stroke-dashoffset animation), 1.2s ease-out
  • Progress/compatibility bars: fill from 0% to value on mount, 0.8s ease-out
  • Skeleton loaders: shimmer sweep from left to right (gradient animation)
  • Transitions: cubic-bezier(0.16, 1, 0.3, 1) — snappy ease-out | fast=0.18s, mid=0.42s, slow=0.72s
  • All list items stagger-animate with 50–80ms delays between each
`;

// ─── Polish Pass (applied to every screen after initial generation) ───────────

const POLISH_PROMPT = `
Apply these final polish passes to make the UI feel like a cinematic premium iOS app:

1. SHIMMER on idle CTA buttons: add a slow diagonal shimmer/sheen sweep (CSS keyframe moving a gradient from left to right, 2.5s infinite) — copper to gold gradient
2. BREATHING ORBS: background radial gradient orbs must pulse (scale 1 → 1.08 → 1) on a 6s ease-in-out infinite alternate loop
3. STAGGER CHECK: verify every list, grid, or row of items uses staggered entrance animations (50–80ms delay increments using animation-delay or JS)
4. MICRO-BOUNCES: all icon buttons (heart save, settings, tabs) must have a spring scale bounce (scale 1 → 1.15 → 1) when tapped/clicked
5. COUNT-UP: all numeric values (scores, percentages, match %) must count up from 0 on mount using requestAnimationFrame
6. BOTTOM NAV: ensure it has glassmorphic backdrop blur, is always fixed to bottom, has safe-area padding
7. SMOOTH TAB/FILTER SWITCHES: when switching tabs or category filters, content must crossfade (not snap) — 0.25s opacity transition
8. COPPER GLOW: cards with scores above 80 should have a subtle copper box-shadow glow: 0 0 20px rgba(212,137,92,0.25)

The result must feel alive — every surface breathing, every interaction responding with delight.
`;

// ─── Page Prompts ──────────────────────────────────────────────────────────────

const PAGES = [
  {
    name: 'home',
    prompt: `${DESIGN_SYSTEM}

Redesign the Home page for Curl IQ — an AI-powered curly hair analysis app for iPhone.

CONTENT & LAYOUT (top to bottom, scrollable):
1. Status bar area (safe-area top)
2. Top bar: "Curl IQ" wordmark (Cormorant Garamond, copper) left, settings gear icon right — fade-in entrance
3. Greeting: "Good morning, Sofia" in Cormorant Garamond 34px warm cream — slide-up entrance with 60ms delay
4. Hero card (glassmorphic, full-width, 200px tall):
   - Large circular SVG arc meter (220px diameter) showing hair health score 78/100
   - Arc traces from bottom-left to bottom-right, copper gradient stroke
   - Arc animates drawing itself on mount (stroke-dashoffset transition, 1s ease-out)
   - Score number "78" in center, counts up from 0 on mount, Cormorant Garamond 52px
   - "Hair Health Score" label below in DM Sans 13px muted
   - Copper glow on the arc: filter: drop-shadow(0 0 8px rgba(212,137,92,0.6))
5. Metrics row (4 horizontal chips with 8px gap, slide-up stagger):
   Moisture 82% (sage green dot), Definition 71% (gold dot), Frizz 34% (copper dot), Elasticity 90% (green dot)
   Each chip: pill shape, glassmorphic, colored left border, percentage counts up
6. "Scan your hair" CTA button — full-width, copper gradient (#D4895C → #C8963C), 56px tall, rounded-full, white text DM Sans 17px bold
   Idle shimmer sweep animation. Slide-up entrance.
7. Section header "Recommended for You" — Cormorant Garamond 22px, slide-up
8. Horizontal scrollable product card row (peek 2.5 cards):
   Each card (160px wide, glassmorphic, 24px radius):
   - 100px image area with gradient overlay
   - Category badge (colored pill, top-left overlay): "Conditioner" sage green
   - Brand "SheaMoisture" DM Sans 11px muted
   - Product name "Curl & Shine Conditioner" DM Sans 14px bold cream
   - Match bar: copper gradient fill, "94% match", fills on mount
   Cards spring in from right with 80ms stagger
9. Fixed bottom nav

ANIMATIONS: All entrance animations trigger on load with stagger. Arc draws on mount. Score counts up. Match bars fill.`,
  },
  {
    name: 'scan',
    prompt: `${DESIGN_SYSTEM}

Redesign the Scan page for Curl IQ — an AI-powered curly hair analysis app for iPhone.

CONTENT & LAYOUT (scrollable, centered feel):
1. Status bar + safe area
2. Page title "Scan Your Hair" — Cormorant Garamond 34px, slide-up entrance
3. Subtitle "Get personalized curl analysis powered by AI" — DM Sans 15px muted, slide-up delay
4. Large upload zone (full-width, 280px tall, glassmorphic card, 24px radius):
   - Dashed border: 2px dashed rgba(212,137,92,0.4), animates via stroke-dashoffset rotation (20s linear infinite)
   - Center: camera icon (36px, copper, float animation: translateY -4px ↔ +4px, 2s ease-in-out infinite)
   - "Tap to upload a photo" DM Sans 16px cream
   - "or drag and drop" DM Sans 13px muted below
   - Zone pulses gently (opacity 0.9 → 1 → 0.9, 3s infinite) when empty
5. Tips section ("Tips for best results" header, Cormorant Garamond 20px):
   3 tip rows stagger-animate in (icon + text):
   • Sun icon: "Good natural or bright lighting"
   • Droplets icon: "Works with wet or dry hair"
   • Zoom icon: "Close-up of curl pattern preferred"
6. "Analyze My Hair" CTA — full-width, copper gradient, 56px, rounded-full, disabled + muted until photo uploaded
7. LOADING STATE (full-screen overlay, shown after photo selected + analyze tapped):
   - Backdrop: blurred dark overlay (backdrop-filter blur(20px) + rgba(12,9,6,0.85))
   - Overlay entrance: fade-in 0.4s
   - Uploaded photo preview (180px square, rounded 20px, centered)
   - Animated scanning beam: a 4px horizontal copper gradient bar sweeping top→bottom over the photo, 1.5s linear infinite
   - Progress bar below photo: copper gradient, smooth fill from 0→100% over ~8s
   - Status message (centered, DM Sans 16px cream): cycles through messages with crossfade:
     "Detecting curl pattern..." → "Analyzing moisture levels..." → "Calculating frizz index..." → "Finding your matches..."
   - Small sparkle/particle burst animation when progress reaches 100%
8. Fixed bottom nav

ANIMATIONS: Camera icon floats continuously. Upload zone pulses. Dashed border rotates. Loading overlay fades in smoothly. Scanning beam sweeps.`,
  },
  {
    name: 'products',
    prompt: `${DESIGN_SYSTEM}

Redesign the Products page for Curl IQ — AI curly hair app, mobile 430px.

LAYOUT (scrollable):
1. Header: "Recommended for You" (Cormorant Garamond 34px) + "24 products matched" (DM Sans 14px copper) — slide-up
2. Horizontal scrollable filter chips: All (copper, active), Shampoo (blue), Conditioner (sage), Leave-In (amber), Curl Cream (teal), Gel (purple), Oil (gold), Mask (rose). Active = filled + 1.05x spring. Inactive = ghost outline.
3. 2-column product grid, 12px gap:
   Each card (glassmorphic, 24px radius): product image 130px tall, colored category badge overlay, brand name (muted 11px), product name (bold 14px, 2-line clamp), copper gradient compatibility bar that fills on mount (0.8s), "94% match" label, heart save toggle (scale-burst on tap).
   Cards stagger-animate in, 40ms delay each.
4. Fixed bottom nav.

ANIMATIONS: Chip tap → spring scale + grid crossfade 0.25s. Bars fill from 0 on mount. Heart: scale 1→1.3→1 spring.`,
  },
  {
    name: 'history',
    prompt: `${DESIGN_SYSTEM}

Redesign the History page for Curl IQ — AI curly hair app, mobile 430px.

LAYOUT (scrollable):
1. Header "Your Progress" (Cormorant Garamond 34px) — slide-up
2. Metric tabs: Overall, Moisture, Definition, Frizz. Active = copper underline indicator that slides on switch.
3. Line chart (full-width glassmorphic card, 240px tall): copper→gold gradient SVG line, draws left-to-right on mount (stroke-dashoffset, 1.2s), area fill fades in after, data dots spring in with stagger. Tab switch = old line fades, new redraws.
4. "Scan History" header + 2-column grid of scan cards (glassmorphic, 24px radius): thumbnail photo, date, score badge (copper glow if >80, green=Good, gold=Fair). Cards stagger in 50ms each.
5. Fixed bottom nav.

ANIMATIONS: Chart draw is the hero. Dots pop in after line. Tab switch crossfades. Score badges glow. Cards stagger.`,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.STITCH_API_KEY) {
    console.error('Error: STITCH_API_KEY is not set.');
    console.error('Add it to .env.local and run with: node --env-file=.env.local scripts/stitch-redesign.mjs');
    process.exit(1);
  }

  await mkdir('stitch-output', { recursive: true });

  const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
  const stitchApi = new Stitch(client);

  console.log('Creating Stitch project...');
  const project = await stitchApi.createProject('Curl IQ Redesign');
  console.log(`Project created: ${project.id}\n`);

  for (const page of PAGES) {
    const outPath = `stitch-output/${page.name}.html`;
    if (await fileExists(outPath)) {
      console.log(`Skipping: ${page.name} (already exists)\n`);
      continue;
    }

    console.log(`Generating: ${page.name}...`);
    const screen = await withRetry(page.name, () =>
      project.generate(page.prompt, 'MOBILE', 'GEMINI_3_PRO')
    );

    console.log(`  Polishing: ${page.name}...`);
    const polished = await withRetry(`${page.name} polish`, () =>
      screen.edit(POLISH_PROMPT)
    );

    console.log(`  Fetching HTML: ${page.name}...`);
    const htmlUrl = await polished.getHtml();
    const res = await fetch(htmlUrl);
    const html = await res.text();

    await writeFile(outPath, html, 'utf8');
    console.log(`  Saved: ${outPath}\n`);
  }

  console.log('All pages generated!');
  console.log('Open stitch-output/*.html in Chrome to review the redesigns.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
