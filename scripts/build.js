// Build prebuilt ESM bundles for static-page consumers (gpdoom-tools, etc.)
// Vite apps use the source directly via npm install; this is only for script-tag import.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/gear/index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/gear.esm.js',
  minify: true,
  platform: 'browser',
});

console.log('Built dist/gear.esm.js');
