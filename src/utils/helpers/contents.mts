import path from "node:path";
import fs from "node:fs/promises";
import { format } from "../../misc/index.mjs";

class TContent {
  private models: string[] = [];
  private root: string;

  constructor(roots: string) {
    this.root = roots;
  }

  public getInstances(model: string) {
    if (this.models.find((m) => m === model)) return;

    this.models.push(model);
  }

  public async createContentIndex() {
    const result = `
      ${this.models.map((model) => `export * from "./${model}";`).join("\n")}
    `;

    const tpath = path.resolve(this.root, "index.ts");

    const [data] = await format(result);

    await fs.writeFile(tpath, data);
  }
}

export default TContent;
