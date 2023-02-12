import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { configMapping } from "../generators/index.mjs";
import { configs } from "../interfaces/index.mjs";

const { mock, type } = configMapping(configs);

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

Object.keys(mock).forEach((model) => {
  const typeName = model.slice(0, 1).toUpperCase() + model.slice(1);

  const _type = `type ${typeName} = {\n${type}\n};\n
  export type {${typeName}};
  `;

  const _mock = `import {${typeName}} from "./${model}.type";\n
    const ${model}: ${typeName} = ${JSON.stringify(mock[model])};\n
    export {${model}};
    `;

  prettier.resolveConfig(p).then(async (options) => {
    const formattedMock = prettier.format(_mock, {
      ...options,
      parser: "babel-ts",
    });
    const formattedType = prettier.format(_type, {
      ...options,
      parser: "babel-ts",
    });

    await fs.writeFile(p + `/${model}.data.ts`, formattedMock);
    await fs.writeFile(p + `/${model}.type.ts`, formattedType);
  });
});
