
<img src="https://raw.githubusercontent.com/AminoffZ/webpack-browser-extension-template/main/public/images/icon256.png" align="right" width="128" title="hover text">

# Browser extension template with webpack 

Quickstart your extension development by using this repository!

## Features
- Typescript for type safe development
- Webpack for significant size reduction
- Manifest version 3 for faster publishing on Chrome

## Develop

### Setup

Clone the project, navigate into folder using terminal and run:
`npm install`

### Adding behaviour

#### 0. Before starting

Make sure you have some understanding of extension development. Here are some resources:
- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

#### 1. Manifest

ChatGPT: In extension development, the manifest is a JSON file that defines the extension's name, version, functionality, permissions, and other details. It is required for all browser extensions and must be carefully constructed to ensure the extension is secure and efficient.

For additional information visit the [Chrome](https://developer.chrome.com/docs/extensions/mv3/manifest/) manifest documentation page. Please note that some browsers, like [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings), require specific information for extensions to work.

#### 2. JavaScript

To add/modify code, modify the files in the _src/scripts/_ folder. They will be compiled to JavaScript when you build the extension. Look at **Build** for more information.

#### What is a _content.ts_/_script.ts_?

ChatGPT: In extension development, a content script is a JavaScript file that runs in the context of a web page and can modify its content and behavior. The content script can read and modify the HTML, CSS, and JavaScript of the web page, and can be used to add new functionality, modify existing functionality, or manipulate the content of the page in various ways.

The name "content.js" is often used as a convention to indicate that the file contains the code for a content script. However, developers are free to use any filename they like for their content script.

On the other hand, "script.js" is a generic name that could be used for any JavaScript file used in an extension, including background scripts, popup scripts, options page scripts, or any other script file that the extension may use.

In summary, "content.js" specifically refers to the file that contains the code for a content script, while "script.js" is a more generic name that could refer to any JavaScript file used in an extension.

#### 3. CSS

To add CSS, create or modify files in the _public/styles/_ folder and make sure they are referenced in the manifest.

#### 4. HTML

HTML can be added [programmatically](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) using JavaScript.

#### 5. Changing the icon

_public/images/icon256.png_

#### 6. Testing your extension

Thankfully you don't have to get your extension published before being able to test it. Refer to **0. Before starting** for information about testing an extension, also referred to as loading unpacked extensions.

## Build

To build the extension, run:
`npm run build`  
The build folder _dist/_ is configured in _webpack/webpack.config.js_. You can add more files, just remember to add the relevant changes to _webpack.config.js_.

# License

MIT License

Copyright (c) 2023 AminoffZ

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
