import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "assets");

const BG = "#0A0A0F";
const RED = "#E50914";
const WHITE = "#FFFFFF";

// ─── 1024×1024 main icon ─────────────────────────────────
function mainIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${RED}"/>
      <stop offset="100%" stop-color="#FF2D2D"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
  <!-- Outer ring -->
  <rect x="48" y="48" width="928" height="928" rx="192" fill="none" stroke="${RED}" stroke-opacity="0.15" stroke-width="4"/>
  <!-- TV/Monitor shape -->
  <rect x="212" y="262" width="600" height="420" rx="48" fill="url(#glow)" opacity="0.12"/>
  <rect x="236" y="286" width="552" height="372" rx="36" fill="url(#glow)" opacity="0.08"/>
  <!-- Main play triangle -->
  <polygon points="440,320 440,540 640,430" fill="url(#glow)" stroke="${WHITE}" stroke-width="8" stroke-linejoin="round" opacity="0.95"/>
  <!-- Play triangle shadow -->
  <polygon points="440,320 440,540 640,430" fill="${RED}" opacity="0.3" transform="translate(0, 6)"/>
  <!-- TV stand -->
  <rect x="438" y="682" width="148" height="18" rx="9" fill="${WHITE}" opacity="0.6"/>
  <rect x="420" y="700" width="184" height="12" rx="6" fill="${WHITE}" opacity="0.3"/>
  <!-- BTL text -->
  <text x="512" y="822" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="120" letter-spacing="32" fill="${WHITE}">BTL</text>
  <text x="512" y="856" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="36" letter-spacing="24" fill="${RED}" opacity="0.8">TV</text>
</svg>`;
}

// ─── Adaptive icon foreground (432×432, visual 108×108 area centered) ──
function foregroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${RED}"/>
      <stop offset="100%" stop-color="#FF2D2D"/>
    </linearGradient>
  </defs>
  <!-- Play triangle -->
  <polygon points="166,120 166,280 306,200" fill="url(#glow)" stroke="${WHITE}" stroke-width="5" stroke-linejoin="round"/>
  <!-- TV outline -->
  <rect x="76" y="100" width="280" height="196" rx="24" fill="none" stroke="${WHITE}" stroke-width="3" opacity="0.5"/>
  <!-- TV stand -->
  <rect x="186" y="296" width="60" height="8" rx="4" fill="${WHITE}" opacity="0.6"/>
  <rect x="176" y="304" width="80" height="6" rx="3" fill="${WHITE}" opacity="0.3"/>
</svg>`;
}

function backgroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <rect width="432" height="432" fill="${BG}"/>
</svg>`;
}

function monochromeSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <polygon points="166,120 166,280 306,200" fill="${WHITE}" stroke="${WHITE}" stroke-width="4" stroke-linejoin="round"/>
  <rect x="76" y="100" width="280" height="196" rx="24" fill="none" stroke="${WHITE}" stroke-width="2" opacity="0.4"/>
  <rect x="186" y="296" width="60" height="8" rx="4" fill="${WHITE}" opacity="0.5"/>
  <rect x="176" y="304" width="80" height="6" rx="3" fill="${WHITE}" opacity="0.2"/>
</svg>`;
}

function splashSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${RED}"/>
      <stop offset="100%" stop-color="#FF2D2D"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <polygon points="412,320 412,640 632,480" fill="url(#glow)" opacity="0.9"/>
  <text x="512" y="780" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="96" letter-spacing="32" fill="${WHITE}">BTL</text>
  <text x="512" y="830" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="500" font-size="30" letter-spacing="20" fill="${RED}" opacity="0.7">TV</text>
</svg>`;
}

async function generate() {
  // 1. Main icon (1024×1024)
  await sharp(Buffer.from(mainIconSVG())).resize(1024, 1024).png().toFile(join(assetsDir, "icon.png"));
  console.log("✓ icon.png");

  // 2. Adaptive icon (1024×1024)
  await sharp(Buffer.from(mainIconSVG())).resize(1024, 1024).png().toFile(join(assetsDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png");

  // 3. Android foreground (432×432)
  await sharp(Buffer.from(foregroundSVG())).resize(432, 432).png().toFile(join(assetsDir, "android-icon-foreground.png"));
  console.log("✓ android-icon-foreground.png");

  // 4. Android background (432×432)
  await sharp(Buffer.from(backgroundSVG())).resize(432, 432).png().toFile(join(assetsDir, "android-icon-background.png"));
  console.log("✓ android-icon-background.png");

  // 5. Android monochrome (432×432)
  await sharp(Buffer.from(monochromeSVG())).resize(432, 432).png().toFile(join(assetsDir, "android-icon-monochrome.png"));
  console.log("✓ android-icon-monochrome.png");

  // 6. Splash icon (1024×1024) - simpler version
  await sharp(Buffer.from(splashSVG())).resize(1024, 1024).png().toFile(join(assetsDir, "splash-icon.png"));
  console.log("✓ splash-icon.png");

  // 7. Favicon (48×48)
  await sharp(Buffer.from(foregroundSVG())).resize(48, 48).png().toFile(join(assetsDir, "favicon.png"));
  console.log("✓ favicon.png");

  console.log("\nAll icons generated successfully!");
}

generate().catch(console.error);
