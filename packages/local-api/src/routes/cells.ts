import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

/*
  The following interface and function is a type guard for Node.js defined errors.
  This is because the Node.js definition file isn't exporting a proper Error definition.
  Without this type guard, calls such as err.code will result in a linting error
*/
interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

const isNodeError = (e: any): e is ErrnoException => {
  return (e as ErrnoException) !== undefined;
};

const defaultFileContent = [
  {
    id: 'aaaaa',
    type: 'text',
    content:
      "# js-pen\nThis is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown.\n- Click any text cell (including this one) to edit it\n- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!\n- You can show any React component, string, number, or anything else by calling the `show` function. This is a function built into this environment. Call show multiple times to show multiple values\n- Re-order or delete cells using the buttons on the top right\n- Add new cells by hovering on the divider between each cell\n- Format your code by clicking on the format button on the top right of the editor\nAll of your changes get saved to the file you opend js-pen with. So if you ran `npx js-pen serve test.js`, all of the text and code you write will be saved to the `test.js` file.\n\nA default file of `notebook.js` will be created (located within js-pen/packages/cli/dist) if a file isn't specified when the application is first ran.",
  },
  {
    id: 'bbbbb',
    type: 'code',
    content:
      "import { useState } from 'react';\r\n\r\nconst Counter = () => {\r\n  const [count, setCount] = useState(0);\r\n  return (\r\n    <div>\r\n      <button onClick={() => setCount(count + 1)}>Click</button>\r\n      <h3>Count: {count}</h3>\r\n    </div>\r\n  )\r\n}\r\n// Display any variable or React Component by calling 'show'\r\nshow(<Counter />);",
  },
  {
    id: 'ccccc',
    type: 'code',
    content:
      'const App = () => {\n  return (\n    <div>\n      <h3>Hello World!</h3>\n      <i>Counter component will be rendered below</i>\n      <hr />\n      {/* Counter was declared in an earlier cell - can be referenced here! */}\n      <Counter />\n    </div>\n  );\n};\nshow(<App />);',
  },
];

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (err) {
      if (isNodeError(err)) {
        if (err.code === 'ENOENT') {
          await fs.writeFile(fullPath, JSON.stringify(defaultFileContent), 'utf-8');
          res.send(defaultFileContent);
        }
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request object
    // Serialize them
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
