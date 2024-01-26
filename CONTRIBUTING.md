# Contributing

This project uses [Bun](https://bun.sh/docs)! If you are on Windows, please refer to [this post](https://github.com/oven-sh/bun/issues/43) on how to make it work on your machine.

#### Install dependencies

```bash
bun install
```

#### Build the project

```bash
bun run build
```

#### Manual Installation:

##### Chrome

- Open your Chrome browser and navigate to [chrome://extensions/](chrome://extensions/).
- Enable "Developer mode" in the top right corner.
- Click on "Load unpacked" and select the <b>dist</b> folder inside the github-repo-size directory (generated after running bun run build).

##### Firefox

- Add this to manifest.json

```json
"background": {
    "scripts": ["background.js"]
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "AminoffZEmail@goesHere.com",
      "strict_min_version": "121.0.1"
    }
  },
```

<b> Please format the project before creating a PR.</b>

```bash
bun run format
```

Most of the business logic for this extension happens inside the [src/scripts/](https://github.com/AminoffZ/github-repo-size/tree/main/src/scripts) folder. If you are looking to make changes, this is most likely the place to start.

### Docs

Visit the [docs page](https://aminoffz.github.io/github-repo-size/docs) for information about specific functions. There are even a few [examples](https://aminoffz.github.io/github-repo-size/docs/functions/internal_crypto.hashClass.html).
