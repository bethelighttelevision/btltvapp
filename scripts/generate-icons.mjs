import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "assets");

const BG = "#0A0A0F";

async function generate() {
  // Use the logo the user placed in assets folder
  const src = join(assetsDir, "LOGO BTL TV.png");

  // 1. Main icon (1024×1024)
  await sharp(src)
    .resize(1024, 1024, { fit: "contain", background: { r: 10, g: 10, b: 15, alpha: 1 } })
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "icon.png"));
  console.log("✓ icon.png");

  // 2. Adaptive icon (1024×1024) — same as main icon
  await sharp(src)
    .resize(1024, 1024, { fit: "contain", background: { r: 10, g: 10, b: 15, alpha: 1 } })
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png");

  // 3. Android foreground (432×432) — logo centered with transparency
  await sharp(src)
    .resize(324, 324, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 54, bottom: 54, left: 54, right: 54, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(assetsDir, "android-icon-foreground.png"));
  console.log("✓ android-icon-foreground.png");

  // 4. Android background (432×432) — solid dark
  await sharp({
    create: { width: 432, height: 432, channels: 3, background: BG },
  })
    .png()
    .toFile(join(assetsDir, "android-icon-background.png"));
  console.log("✓ android-icon-background.png");

  // 5. Android monochrome (432×432) — white-only logo on dark
  const monoBuf = await sharp(src)
    .resize(324, 324, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .grayscale()
    .linear(3, 0)
    .png()
    .toBuffer();

  await sharp({
    create: { width: 432, height: 432, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: monoBuf, top: 54, left: 54 }])
    .png()
    .toFile(join(assetsDir, "android-icon-monochrome.png"));
  console.log("✓ android-icon-monochrome.png");

  // 6. Splash icon (1024×1024)
  await sharp(src)
    .resize(512, 512, { fit: "contain", background: { r: 10, g: 10, b: 15, alpha: 1 } })
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "splash-icon.png"));
  console.log("✓ splash-icon.png");

  // 7. Favicon (48×48)
  await sharp(src)
    .resize(48, 48, { fit: "contain", background: { r: 10, g: 10, b: 15, alpha: 1 } })
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "favicon.png"));
  console.log("✓ favicon.png");

  console.log("\nAll icons generated from professional logo!");
}

generate().catch(console.error);
