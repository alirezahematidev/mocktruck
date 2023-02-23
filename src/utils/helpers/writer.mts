import fs from "node:fs/promises";
import path from "node:path";

class Writer {
  private target: string = process.cwd();

  constructor(target: string) {
    this.target = target;
  }

  public async writeType(name: string, data: string, types?: boolean) {
    if (!types) return;

    const extension = ".ts";

    const file = name + extension;

    const tpath = path.resolve(this.target, file);

    await fs.writeFile(tpath, data);
  }

  public async writeMock(name: string, data: string, types?: boolean) {
    const extension = types ? ".ts" : ".js";

    const file = name + extension;

    const tpath = path.resolve(this.target, file);

    await fs.writeFile(tpath, data);
  }
}

export { Writer };
