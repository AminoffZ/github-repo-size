const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
async function updateManifestVersion() {
  try {
    const packageJsonPath = path.join(import.meta.dir, 'package.json');
    const { version } = await import(packageJsonPath);

    const manifestPath = path.join(import.meta.dir, 'public', 'manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestData);

    manifest.version = version;

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(chalk.green('Version updated successfully in manifest.json'));
  } catch (error: any) {
    console.error(chalk.red('Error updating version: ' + error.message));
  }
}

updateManifestVersion();
