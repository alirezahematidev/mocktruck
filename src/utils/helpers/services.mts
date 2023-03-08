import { createCommonJS } from "mlly";
import * as misc from "../../misc/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

const { __dirname } = createCommonJS(import.meta.url);

type TServiceRoute = {
  key: string;
  model: string;
  route: string;
};

class TServices {
  private routes: TServiceRoute[] = [];

  // public async index(port: number) {
  //   const target = path.resolve(process.cwd(), "src/services/index.ts");

  //   const data = await fs.readFile(target);

  //   const content = data.toString();

  //   const modified = content.replace(
  //     /(app\.listen)\((\d+)\)/gim,
  //     (match, exp: string) => {
  //       return `${exp}(${port})`;
  //     },
  //   );

  //   await fs.writeFile(target, modified);
  // }

  public async define() {
    try {
      const template = `
      import express from "express";
      ${this.routes
        .map(
          (r) =>
            `import ${r.model}Input from "../configs/${r.model}_${r.key}.mjs"`,
        )
        .join("\n")}


      const router = express.Router();

      ${this.routes.map((r) => r.route).join("\n")}

      export default router;
    `;

      const target = path.resolve(__dirname, "../../services", "routes.ts");

      const options = await prettier.resolveConfig(target);

      const format = prettier.format(template, {
        ...options,
        parser: "babel-ts",
        endOfLine: "lf",
      });

      await fs.writeFile(target, format);
    } catch (error) {
      throw error;
    }
  }

  public async regenerate() {
    const target = path.resolve(__dirname, "../../configs");

    try {
      await fs.access(target, fs.constants.R_OK);

      const dirs = await fs.readdir(target);

      for (const dir of dirs) {
        const configFile = path.resolve(target, dir);

        await fs.rm(configFile, { force: true, recursive: true });
      }
    } catch (error) {
      await fs.mkdir(target, { recursive: true });
    }
  }

  public async createConfig(model: string, input: string, key: string) {
    const target = path.resolve(__dirname, "../../configs");

    const options = await prettier.resolveConfig(target);

    const format = prettier.format(misc.joinStrings("export default", input), {
      ...options,
      parser: "babel-ts",
      endOfLine: "lf",
    });

    await fs.writeFile(path.resolve(target, `${model}_${key}.mts`), format);

    const route = misc.mapRoute(model, misc.stackString(model, "Input"), key);

    this.routes.push({ key, model, route });
  }
}

export default TServices;
