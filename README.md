# js-notepen CLI Tool

This is a CLI to launch an interactive development environment for writing and documenting code for Javascript in a browser. Users can add code or text cells, and save their work into a local file.

This project was created with create-react-app and was bootstrapped with Lerna. @js-notepen/local-api and @js-notepen/local-client are required dependencies to the CLI.

## Installing/Running

In your preferred command line tool, to install:

### `npm install -g js-notepen`

To run directly:

### `npx js-notepen serve`

Open [http://localhost:4005](http://localhost:4005) to view the project in the browser.

## Optional Fields to the Command

The command accepts optional port field or specific file that you want to open:

### `npx js-notepen serve [filename] [-p portNum]`

## Displaying Code in the Preview Window

Call the special built in function `show()` to display code in the preview window.

```js
show(123);
```

Renders 123 on the preview window.

```js
const App = () => {
  return <h1>Hello World</h1>;
};

show(<App />);
```

Renders the App component on the preview window.

## Importing npm Modules

Users can import any arbitrary module directly from npm in the code cells with `import` statements.
Importing CSS files from npm is also possible.

```js
import axios from 'axios';
import 'bulma/css/bulma.css';
```

## Saving Files

This application by default saves all code/notes written by the user into a file called 'notebook.js' in JSON format, if a file to open was not specified when the `serve` command was first ran in the command line tool.

### Disclaimer on JSX Syntax Highlighting

This project uses an untested package for JSX syntax highlighting that may break over time, but this does _not_ affect the overall functionality of the application.
