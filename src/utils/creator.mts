import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { Builder } from "../generator/index.mjs";
import * as misc from "../misc/index.mjs";
import serialize from "serialize-javascript";
import { DATA_WORD, TYPE_WORD } from "../constants/index.mjs";
import { Writer } from "./helpers/writer.mjs";
import glob from "glob";
import { Truck } from "../typings/index.mjs";
import { Request } from "./helpers/request.mjs";

type ImportedConfig = Record<string, Truck.Configuration>;

const globOptions: glob.IOptions = {
  absolute: true,
  cwd: process.cwd(),
  mark: true,
  stat: true,
  cache: {
    [process.cwd()]: "DIR",
  },
};

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

async function create(configs: Truck.Configuration) {
  try {
    const configure = misc.awaited(Builder.configure);

    const configOptions = await configure(configs);

    const output = getOutput(configOptions.output);

    const entry = getEntry(configOptions.entry);

    const globalOptions = configOptions.globalOptions;

    const clean = misc.cleaner(globalOptions);

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

    const request = new Request();

    await request.regenerateConfigs();

    const writeDataList = data.map(async (model) => {
      const mock = Builder.entries.data[model];

      const isArray = Builder.entries.isArray;

      const modelOptions = Builder.modelOptions(model);

      const input = serialize(mock, { isJSON: false });

      const options = misc.getOptions(globalOptions, modelOptions) ?? {};

      const typedRaw = misc.typedRaw(model, Builder.types(model));

      const withTypes = misc.canUseTypes(options);

      const mockedRaw = misc.mockedRaw({
        model,
        input,
        isArray,
        withTypes,
      });

      const key = misc.randomKey(8);

      await request.createRouteConfig(model, input, key);

      const prettierOptions = await prettier.resolveConfig(root);

      const fMock = prettier.format(mockedRaw, {
        ...prettierOptions,
        parser: "babel-ts",
        endOfLine: "lf",
      });
      const fType = prettier.format(typedRaw, {
        ...prettierOptions,
        parser: "babel-ts",
        endOfLine: "lf",
      });

      const target = path.resolve(root, model);

      const writer = new Writer(target);

      await fs.mkdir(target, { recursive: true });

      await Promise.allSettled([
        writer.writeMock(DATA_WORD, fMock, withTypes),
        writer.writeType(TYPE_WORD, fType, withTypes),
      ]);
    });

    await Promise.all(writeDataList);

    await request.writeRoutes();
  } catch (error) {
    throw error;
  }
}

glob("**/truck.config.{js,ts,mjs,mts}", globOptions, (err, matches) => {
  if (err) throw err;

  let __immediate: NodeJS.Immediate;

  if (!matches || !matches.length) {
    console.log("no configuration file found");
    process.exit(1);
  }

  if (matches.length > 1) {
    console.log("multiple configuration files found. please provide one");
    process.exit(1);
  }
  __immediate = setImmediate(async () => {
    try {
      const match = matches[0];

      const importedConfig: ImportedConfig = await import("file://" + match);

      const proxyHandler = {
        get(target: ImportedConfig, prop: string) {
          if (["default", "configs"].includes(prop)) {
            if (isValidConfiguration(target[prop])) {
              return target[prop];
            }
            return null;
          }
          return null;
        },
      };

      const configProxy = new Proxy(importedConfig, proxyHandler);

      const configs = configProxy.default || configProxy.configs;

      if (configs) {
        return await createConfigs(configs);
      }

      console.log(
        "The configuration must be export default or export name by `configs`",
      );

      process.exit(1);
    } catch (error) {
      console.log(error);
    } finally {
      clearImmediate(__immediate);
    }
  });
});

function isValidConfiguration(configs: Truck.Configuration) {
  return !!(configs && configs.models);
}

async function createConfigs(configs: Truck.Configuration) {
  function isValidModel(model: Truck.ConfigModel) {
    return Boolean(model.name) && misc.isOptionEnabled(model.schema);
  }

  try {
    const models = misc.parseIterable(configs.models);

    if (models.every(isValidModel)) {
      return await create(configs);
    }

    throw new Error(
      "models must have name and schema. beware to defined them in each model",
    );
  } catch (error) {
    console.log("An error occured: " + error);
  } finally {
    await Builder.loggerInstance.save();
  }
}
