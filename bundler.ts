import entryPoints from './entrypoints';

const entrypoints = await entryPoints();

await Bun.build({
  entrypoints: entrypoints,
  outdir: './github-repo-size-extension',
  minify: true,
});
