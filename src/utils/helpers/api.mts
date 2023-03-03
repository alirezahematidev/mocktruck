import { createCommonJS } from "mlly";
import path from "node:path";
import fs from "node:fs/promises";
import { TYPE_WORD } from "../../constants/index.mjs";

const { __dirname } = createCommonJS(import.meta.url);

class TApiRequest {
  private models: string[] = [];
  private target: string = __dirname;

  constructor(target: string) {
    this.target = target;
  }

  public getInstances(model: string) {
    if (this.models.find((m) => m === model)) return;

    this.models.push(model);
  }

  public async type(data: string, types: boolean) {
    if (!types) return;

    const file = TYPE_WORD + ".ts";

    const tpath = path.resolve(this.target, file);

    await fs.writeFile(tpath, data);
  }

  public async data(data: string) {
    const tpath = path.resolve(this.target, "index.ts");

    await fs.writeFile(tpath, data);
  }
}

export default TApiRequest;
