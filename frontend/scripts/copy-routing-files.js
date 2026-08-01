import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCopy = [
  { source: 'public/_redirects', dest: 'dist/_redirects' },
  { source: 'public/_headers', dest: 'dist/_headers' },
  { source: '.htaccess', dest: 'dist/.htaccess' },
  { source: 'netlify.toml', dest: 'dist/netlify.toml' },
  { source: 'vercel.json', dest: 'dist/vercel.json' }
];

filesToCopy.forEach(({ source, dest }) => {
  const sourcePath = path.join(__dirname, '..', source);
  const destPath = path.join(__dirname, '..', dest);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${source} to ${dest}`);
  } else {
    console.log(`Skipping ${source} (not found)`);
  }
});

console.log('Routing files copied successfully');