// Post-build step: inject PWA + social meta tags into the Expo Web HTML output.
// Expo's Metro web bundler emits a minimal index.html. This script enriches the
// <head> with the manifest link, Apple touch icon, OG/Twitter tags, and
// description, then copies the static files in /public into the dist directory
// so they're served from the site root.

import { readFile, writeFile, cp, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const distDir = join(cwd(), 'dist');
const publicDir = join(cwd(), 'public');
const indexPath = join(distDir, 'index.html');

const TITLE = 'The Ladder Was a Lie';
const DESCRIPTION =
  'A 2-minute reflection. Seven questions. No right answers. Redefine what success actually looks like — for you.';
const URL = 'https://ladder-was-a-lie.vercel.app';

const HEAD_INJECTION = `
    <meta name="description" content="${DESCRIPTION}" />

    <style>
      html, body, #root { height: 100%; margin: 0; }
      html, body { overflow: hidden; overscroll-behavior: none; }
      #root { display: flex; flex-direction: column; min-height: 0; }
      @supports (height: 100dvh) {
        html, body, #root { height: 100dvh; }
      }
    </style>

    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Ladder" />
    <meta name="mobile-web-app-capable" content="yes" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${URL}" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:image" content="${URL}/icon-512.png" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image" content="${URL}/icon-512.png" />
`;

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function copyPublic() {
  if (!(await exists(publicDir))) {
    console.log('[postbuild] no public/ directory; skipping copy');
    return;
  }
  await cp(publicDir, distDir, { recursive: true });
  console.log('[postbuild] copied public/ into dist/');
}

async function injectHead() {
  if (!(await exists(indexPath))) {
    throw new Error(`[postbuild] dist/index.html not found at ${indexPath}`);
  }
  let html = await readFile(indexPath, 'utf8');
  if (html.includes('ladder-pwa-injected')) {
    console.log('[postbuild] head already injected; skipping');
    return;
  }
  const tagged = HEAD_INJECTION + '    <meta name="ladder-pwa-injected" content="1" />\n';
  html = html.replace('</head>', `${tagged}  </head>`);
  await writeFile(indexPath, html);
  console.log('[postbuild] injected PWA meta into dist/index.html');
}

await copyPublic();
await injectHead();
