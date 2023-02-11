import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { configMapping } from "../generators/index.mjs";
import { configs } from "../interfaces/index.mjs";

const content = configMapping(configs);

const p = path.resolve(process.cwd(), "./out");

const emptyFolder = async (folderPath: string) => {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      await fs.unlink(path.resolve(folderPath, file));
      console.log(`${folderPath}\\${file} has been removed successfully`);
    }
  } catch (err) {
    console.log(err);
  }
};

emptyFolder(p);

Object.keys(content).forEach((model) => {
  const typeContent = `const ${model} = ${JSON.stringify(content[model])}`;
  prettier.resolveConfig(p).then(async (options) => {
    const format = prettier.format(typeContent, {
      ...options,
      parser: "babel-ts",
    });

    await fs.writeFile(p + `/${model}.data.ts`, format);
  });
});
