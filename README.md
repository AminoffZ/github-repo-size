<img align="right" src="/public/favicon.png" />

# GitHub Repo Size

An extension to display the size of GitHub repositories.
A continuation on [github-repo-size](https://github.com/harshjv/github-repo-size).

## Features

View summary of file sizes in repositories.

![Screenshot](/assets/github-repo-size-screenshot.png)

It's also possible to view private repository size summaries by adding a personal access token.[^1]

![Screenshot](/assets/github-repo-size-popup.png)

GitHubs API has a limit of 50 (at time of writing) requests per hour for unauthenticated requests. By clicking Authenticate and signing in with OAuth, you can make up to 5000 requests per hour.[^2]

[^1]: [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
[^2]: [Rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limits)

## Requirements

Chromium based browser.

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
