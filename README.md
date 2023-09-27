[![Google Chrome](https://img.shields.io/chrome-web-store/v/jpdmfnflpdgefbfkafcikmhipofhanfl?label=Get%20GRS%20for%20Chrome&logo=Google%20Chrome)](https://chrome.google.com/webstore/detail/github-repo-size/jpdmfnflpdgefbfkafcikmhipofhanfl)

<img src="/public/favicon.png" align="right"  />

# GitHub Repo Size

An extension to display the size of GitHub repositories.
Inspired by [github-repo-size](https://github.com/harshjv/github-repo-size).

## Features

View summary of file sizes in repositories.

<img src="/assets/github-repo-size-screenshot.png" />

It's also possible to view private repository size summaries by adding a personal access token.[^1]

<img src="/assets/github-repo-size-popup.png" />

GitHubs API has a limit of 50 (at time of writing) requests per hour for unauthenticated requests. By clicking Authenticate and signing in with OAuth, you can make up to 5000 requests per hour.[^2]

[^1]: [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
[^2]: [Rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limits)

## Requirements

Chromium based browser.

## Updates

Notice something that doesn't work the way you expected? Do you have your own suggestions for how to make the user experience better? Submit an [Issue](https://github.com/AminoffZ/github-repo-size/issues) and explain your concern.

## Contributing

Because this project uses [Bun](https://bun.sh/docs), you can use either `bun` or `npm` for the commands listed bellow.

Install dependencies

```bash
bun install
```

Build the project

```bash
bun run build
```

Please format the project before creating a PR.

```bash
bun run format
```

Most of the business logic for this extension happens inside the [src/scripts/](https://github.com/AminoffZ/github-repo-size/tree/main/src/scripts) folder. If you are looking to make changes, this is most likely the place to start.

Thank you all and happy coding!

---

MIT License

Copyright (c) 2023 AminoffZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
