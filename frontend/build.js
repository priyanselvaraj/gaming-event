import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all static frontend assets into dist/ for Vercel
const files = fs.readdirSync(__dirname);
for (const file of files) {
  if (['dist', 'node_modules', 'src', '.git', 'package.json', 'package-lock.json', 'postcss.config.js', 'tailwind.config.js', 'vite.config.js', 'build.js'].includes(file)) {
    continue;
  }
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> dist/`);
  }
}

// Copy public folder if exists
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  for (const pf of publicFiles) {
    fs.copyFileSync(path.join(publicDir, pf), path.join(distDir, pf));
  }
}

console.log('✅ Static build complete! All pages and scripts ready in dist/');
