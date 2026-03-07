#!/usr/bin/env node
/**
 * Downloads Google Fonts woff2 files for self-hosting.
 * Run: node scripts/download-fonts.mjs
 *
 * Downloads to public/fonts/ with filenames matching @font-face declarations
 * in src/index.css (main app) and public/pitch.html (pitch deck).
 *
 * Expected output files:
 *   Main app:  dm-serif-display-400.woff2, lora-normal.woff2, lora-italic.woff2, dm-sans-400.woff2
 *   Pitch deck: playfair-display-400.woff2, playfair-display-700.woff2,
 *               playfair-display-400-italic.woff2, inter-300.woff2, inter-400.woff2,
 *               inter-500.woff2, inter-600.woff2, inter-700.woff2
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, '..', 'public', 'fonts');
mkdirSync(FONTS_DIR, { recursive: true });

const CHROME_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Main app fonts (variable font versions for Lora)
const MAIN_CSS = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz@9..40&display=swap';

// Pitch deck fonts
const PITCH_CSS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap';

async function downloadFont(url, filename) {
  const filepath = join(FONTS_DIR, filename);
  if (existsSync(filepath)) {
    console.log(`  Skipping: ${filename} (exists)`);
    return;
  }
  console.log(`  Downloading: ${filename}`);
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  writeFileSync(filepath, Buffer.from(buf));
  console.log(`    Saved (${buf.byteLength} bytes)`);
}

async function fetchAndParseFontCSS(cssUrl) {
  const cssRes = await fetch(cssUrl, { headers: { 'User-Agent': CHROME_UA } });
  const css = await cssRes.text();
  const blocks = css.split('@font-face').slice(1);
  return blocks.map(block => ({
    family: block.match(/font-family:\s*'([^']+)'/)?.[1],
    weight: block.match(/font-weight:\s*(\d+)/)?.[1] || '400',
    style: block.match(/font-style:\s*(\w+)/)?.[1] || 'normal',
    url: block.match(/url\(([^)]+\.woff2)\)/)?.[1],
    unicodeRange: block.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim(),
  })).filter(b => b.url && b.family);
}

function isLatinBlock(unicodeRange) {
  if (!unicodeRange) return true;
  return unicodeRange.includes('U+0000') || unicodeRange.includes('U+0100');
}

async function main() {
  // --- Main app fonts ---
  console.log('\n=== Main App Fonts ===');
  const mainBlocks = await fetchAndParseFontCSS(MAIN_CSS);

  for (const b of mainBlocks) {
    if (!isLatinBlock(b.unicodeRange)) continue;
    const safeName = b.family.replace(/\s+/g, '-').toLowerCase();

    // Variable font filenames to match CSS declarations
    let filename;
    if (safeName === 'lora') {
      filename = `lora-${b.style === 'italic' ? 'italic' : 'normal'}.woff2`;
    } else {
      filename = `${safeName}-${b.weight}${b.style === 'italic' ? '-italic' : ''}.woff2`;
    }

    await downloadFont(b.url, filename);
  }

  // --- Pitch deck fonts ---
  console.log('\n=== Pitch Deck Fonts ===');
  const pitchBlocks = await fetchAndParseFontCSS(PITCH_CSS);

  for (const b of pitchBlocks) {
    if (!isLatinBlock(b.unicodeRange)) continue;
    const safeName = b.family.replace(/\s+/g, '-').toLowerCase();
    const filename = `${safeName}-${b.weight}${b.style === 'italic' ? '-italic' : ''}.woff2`;
    await downloadFont(b.url, filename);
  }

  console.log('\nDone! Font files saved to public/fonts/');
}

main().catch(console.error);
