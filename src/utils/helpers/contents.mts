import path from "node:path";
import fs from "node:fs/promises";
import { format } from "../../misc/index.mjs";
import { __PORT__ } from "../../constants/global.constants.mjs";
import { TruckArgs } from "../../../cli/types/cli.type.mjs";

class TContent {
  private models: string[] = [];
  private roots: string[] = [];

  constructor(roots: string[]) {
    this.roots = roots;
  }

  public getInstances(model: string) {
    if (this.models.find((m) => m === model)) return;

    this.models.push(model);
  }

  public async createContentIndex() {
    const result = `
      ${this.models.map((model) => `export * from "./${model}";`).join("\n")}
    `;

    const tpath = path.resolve(this.roots[0], "index.ts");

    const [data] = await format([tpath, result]);

    await fs.writeFile(tpath, data);
  }

  public async createApiIndex(args: TruckArgs) {
    if (!args.server) return;

    const urlTemp = `
    const BASE_URL = "http://localhost:${args.port ?? __PORT__}/___truck/"
    
    export default BASE_URL;
    ;
`;

    const result = `
      ${this.models.map((model) => `export * from "./${model}";`).join("\n")}
    `;

    const tpath = path.resolve(this.roots[1], "index.ts");
    const urlpath = path.resolve(this.roots[1], "url.ts");

    const [data, url] = await format([tpath, result], [urlpath, urlTemp]);

    await Promise.all([fs.writeFile(tpath, data), fs.writeFile(urlpath, url)]);
  }
}

export default TContent;
