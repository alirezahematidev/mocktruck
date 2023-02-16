import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { configs } from "../interfaces/index.mjs";
import { Builder } from "../generator/index.mjs";
import * as misc from "../misc/index.mjs";
import serialize from "serialize-javascript";

async function create() {
  try {
    const configure = misc.awaited(Builder.configure);

    await configure(configs);

    const root = path.resolve(process.cwd(), "./out");

    const emptyFolder = async (folderPath: string) => {
      const dirs = await fs.readdir(folderPath);

      for (const dir of dirs) {
        const rd = path.resolve(folderPath, dir);

        await fs.rm(rd, { recursive: true, force: true });
      }
    };

    await emptyFolder(root);

    misc.getKeys(Builder.entries.data).forEach((model) => {
      const typeName = misc.cap(model);

      const mock = Builder.entries.data[model];

      const isArray = Builder.entries.isArray;

      const input = serialize(mock, { isJSON: false });

      const typedRaw = misc.typedRaw(typeName, Builder.types(model));

      const mockedRaw = misc.mockedRaw(input, model, typeName, isArray);

      prettier.resolveConfig(root).then(async (options) => {
        const formattedMock = prettier.format(mockedRaw, {
          ...options,
          parser: "babel-ts",
        });
        const formattedType = prettier.format(typedRaw, {
          ...options,
          parser: "babel-ts",
        });

        const target = path.resolve(root, model);

        await Promise.all([
          fs.mkdir(target, { recursive: true }),
          fs.writeFile(path.resolve(target, `data.ts`), formattedMock),
          fs.writeFile(path.resolve(target, `type.ts`), formattedType),
        ]);
      });
    });
  } catch (error) {
    throw error;
  }
}

create().catch((error) => console.log("AN ERROR OCCURED:", error));
