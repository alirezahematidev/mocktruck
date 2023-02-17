import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { Truck, configs } from "../interfaces/index.mjs";
import { Builder } from "../generator/index.mjs";
import * as misc from "../misc/index.mjs";
import serialize from "serialize-javascript";

function getEntry(entry?: string) {
  const current = process.cwd();

  if (entry) {
    return path.resolve(current, entry);
  }

  return current;
}

function getOutput(output?: string) {
  /** Default output directory */
  const DEFAULT_OUT = "out";

  if (output) {
    return output;
  }

  return DEFAULT_OUT;
}

function getOptions(
  globalOptions: Truck.GlobalOptions | undefined,
  options: Truck.Options | undefined,
) {
  const isOptionEnabled = misc.isOptionEnabled(options);
  const isGlobalOptionEnabled = misc.isOptionEnabled(globalOptions);

  if (!isGlobalOptionEnabled && !isOptionEnabled) return;

  if (options === undefined) {
    return globalOptions;
  }

  if (globalOptions === undefined) {
    return options;
  }

  return { ...globalOptions, ...options };
}

async function create() {
  try {
    const configure = misc.awaited(Builder.configure);

    const configOptions = await configure(configs);

    const output = getOutput(configOptions.output);

    const entry = getEntry(configOptions.entry);

    const globalOptions = configOptions.globalOptions;

    let clean = true;

    if (misc.isOptionEnabled(globalOptions)) {
      const c = globalOptions.clean;

      clean = misc.valuable(c) ? c : true;
    }

    try {
      await fs.access(output, fs.constants.R_OK);
    } catch (err) {
      await fs.mkdir(path.resolve(entry, output));
    }

    const root = path.resolve(entry, output);

    const data = misc.getKeys(Builder.entries.data);

    const emptyFolder = async (folderPath: string) => {
      const dirs = await fs.readdir(folderPath);

      const cdirs = misc.compareAndFilter(dirs, data);

      const fdirs = clean ? dirs : cdirs;

      for (const dir of fdirs) {
        const rd = path.resolve(folderPath, dir);

        await fs.rm(rd, { recursive: true, force: true });
        // logger.warn(`${dir} directory removed successfully!`);
      }
    };

    await emptyFolder(root);

    data.forEach((model) => {
      const typeName = misc.cap(model);

      const mock = Builder.entries.data[model];

      const isArray = Builder.entries.isArray;

      const modelOptions = Builder.modelOptions(model);

      const input = serialize(mock, { isJSON: false });

      const typedRaw = misc.typedRaw(typeName, Builder.types(model));

      const options = getOptions(globalOptions, modelOptions) ?? {};

      let withTypes = true;

      let mockFileName = "data";

      let typeFileName = "type";

      if (misc.isOptionEnabled(options)) {
        const filename = options.mockFileName;
        const typename = options.typesFileName;
        const useTypes = options.useTypes;

        withTypes = misc.valuable(useTypes) ? useTypes : true;

        if (filename) {
          mockFileName = filename;
        }

        if (typename) {
          typeFileName = typename;
        }
      }

      const mockedRaw = misc.mockedRaw({
        model,
        input,
        typeName,
        isArray,
        withTypes,
      });

      prettier.resolveConfig(root).then(async (options) => {
        const fMock = prettier.format(mockedRaw, {
          ...options,
          parser: "babel-ts",
          endOfLine: "lf",
        });
        const fType = prettier.format(typedRaw, {
          ...options,
          parser: "babel-ts",
          endOfLine: "lf",
        });

        const target = path.resolve(root, model);

        const writer = new Writer(target);

        await Promise.allSettled([
          fs.mkdir(target, { recursive: true }),
          writer.writeMock(mockFileName, fMock, withTypes),
          writer.writeType(typeFileName, fType, withTypes),
        ]);
      });
    });
  } catch (error) {
    throw error;
  }
}

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

create()
  .catch((error) => Builder.loggerInstance.failed("AN ERROR OCCURED:" + error))
  .finally(Builder.loggerInstance.save);
