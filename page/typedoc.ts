import * as TypeDoc from 'typedoc';
import entryPoints from '../entrypoints.ts';

async function main() {
  // Application.bootstrap also exists, which will not load plugins
  // Also accepts an array of option readers if you want to disable
  // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
  const entrypoints = await entryPoints({ root: '../src/scripts', deep: true });
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: entrypoints,
    plugin: ['typedoc-plugin-extras'],
    name: 'GitHub Repo Size',
    // @ts-ignore
    favicon:
      'https://raw.githubusercontent.com/AminoffZ/github-repo-size/main/assets/github-repo-size-icon256.png',
  });

  const project = await app.convert();

  if (project) {
    // Project may not have converted correctly
    const outputDir = './github-repo-size-extension/docs';

    // Rendered docs
    await app.generateDocs(project, outputDir);
    // Alternatively generate JSON output
    await app.generateJson(project, outputDir + '/documentation.json');
  }
}

main().catch(console.error);
