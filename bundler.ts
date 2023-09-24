import entryPoints from './entrypoints';

const entrypoints = await entryPoints();

await Bun.build({
  entrypoints: entrypoints,
  outdir: './dist',
  minify: true,
});
