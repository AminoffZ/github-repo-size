import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import glob from 'tiny-glob';

function hash(value: string) {
  let hash = 5381;
  let i = value.length;
  while (i) hash = (hash * 33) ^ value.charCodeAt(--i);
  return (hash >>> 0).toString(36);
}

async function removeInlineScriptAndStyle(directory: string) {
  console.log('Removing Inline Scripts and Styles');
  const scriptRegx = /<script[^>]*>([\s\S]+?)<\/script>/g;
  const styleRegx = /<style[^>]*>([\s\S]+?)<\/style>/g;
  const files = await glob('**/*.html', {
    cwd: directory,
    dot: true,
    absolute: false,
    filesOnly: true,
  });

  console.log(`Found ${files.length} files`);

  for (const file of files.map((f) => join(directory, f))) {
    console.log(`Edit file: ${file}`);
    let f = readFileSync(file, { encoding: 'utf-8' });

    let script;
    while ((script = scriptRegx.exec(f))) {
      const inlineScriptContent = script[1]
        .replace('__sveltekit', 'const __sveltekit')
        .replace(
          'document.currentScript.parentElement',
          'document.body.firstElementChild'
        );
      const fn = `/script-${hash(inlineScriptContent)}.js`;
      f = f.replace(
        script[0], // Using script[0] to replace the entire matched script tag
        `<script type="module" src="${fn}"></script>`
      );
      writeFileSync(`${directory}${fn}`, inlineScriptContent);
      console.log(`Inline script extracted and saved at: ${directory}${fn}`);
    }

    let style;
    while ((style = styleRegx.exec(f))) {
      const inlineStyleContent = style[1];
      const fn = `/style-${hash(inlineStyleContent)}.css`;
      f = f.replace(
        style[0], // Using style[0] to replace the entire matched style tag
        `<link rel="stylesheet" href="${fn}" />`
      );
      writeFileSync(`${directory}${fn}`, inlineStyleContent);
      console.log(`Inline style extracted and saved at: ${directory}${fn}`);
    }

    writeFileSync(file, f);
  }
}

removeInlineScriptAndStyle(
  resolve(import.meta.dir, 'github-repo-size-extension')
);
