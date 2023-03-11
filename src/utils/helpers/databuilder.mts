import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { createCommonJS } from "mlly";
import { DATA_WORD, TYPE_WORD } from "../../constants/index.mjs";

const { __dirname } = createCommonJS(import.meta.url);

class TDataBuilder {
  private target: string = __dirname;

  constructor(target: string) {
    this.target = target;
  }

  public async type(data: string, types?: boolean) {
    if (!types) return;

    const file = TYPE_WORD + ".ts";

    const tpath = path.resolve(this.target, file);

    await fs.writeFile(tpath, data);
  }

  public async data(data: string) {
    const file = DATA_WORD + ".ts";

    const tpath = path.resolve(this.target, file);

    await fs.writeFile(tpath, data);
  }

  public async index(types?: boolean) {
    const extension = types ? ".ts" : ".js";

    const file = "index" + extension;

    const template = `
      export * from "./data";
      export * from "./type";
    `;

    const tpath = path.resolve(this.target, file);

    const data = prettier.format(template, { parser: "babel-ts" });

    await fs.writeFile(tpath, data);
  }
}

export default TDataBuilder;
