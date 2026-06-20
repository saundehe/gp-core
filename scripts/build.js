// Build prebuilt ESM bundles for static-page consumers (gpdoom-tools, etc.)
// Vite apps use the source directly via npm install; this is only for script-tag import.
import { build } from 'esbuild';

const bundles = [
  { entryPoints: ['src/gear/index.js'],    outfile: 'dist/gear.esm.js' },
  { entryPoints: ['src/account/index.js'], outfile: 'dist/account.esm.js' },
  { entryPoints: ['src/part/index.js'],    outfile: 'dist/part.esm.js' },
  { entryPoints: ['src/theory/index.js'], outfile: 'dist/theory.esm.js' },
];

for (const b of bundles) {
  await build({ ...b, bundle: true, format: 'esm', minify: true, platform: 'browser' });
  console.log('Built', b.outfile);
}
