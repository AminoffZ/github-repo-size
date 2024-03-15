/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
async function updateManifestVersion() {
  try {
    const arg = process.argv[2];
    const browser = arg && arg === 'firefox' ? 'firefox' : 'chrome';

    const packageJsonPath = path.join(import.meta.dir, 'package.json');
    const { version } = await import(packageJsonPath);

    const manifestPath = path.join(import.meta.dir, 'public', 'manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestData);

    manifest.version = version;

    if (browser && browser === 'firefox') {
      manifest.background = {
        scripts: ['background.js'],
      };

      manifest.browser_specific_settings = {
        gecko: {
          id: 'mouiylus@gmail.com',
          strict_min_version: '121.0.1',
        },
      };
    } else {
      manifest.background = {
        service_worker: 'background.js',
      };
      delete manifest.browser_specific_settings;
    }
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(
      chalk.green(
        'Version updated successfully in manifest.json for ' +
          browser +
          ' Browser!'
      )
    );
  } catch (error: unknown) {
    console.error(chalk.red('Error updating version: ' + error.message));
    process.exit(1);
  }
}

updateManifestVersion();
