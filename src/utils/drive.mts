import Truck from "../interfaces/index.js";
import * as misc from "../misc/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import glob from "fast-glob";
import serialize from "serialize-javascript";
import TContent from "./helpers/contents.mjs";
import TDataBuilder from "./helpers/databuilder.mjs";
import parsePlugins from "./plugin.mjs";
import Builder from "../generator/index.mjs";
import { __CONTENTS__ } from "../constants/global.constants.mjs";
import Logger from "../log/index.mjs";
import isError from "lodash/isError.js";

const exportMatchers: ReadonlyArray<string> = ["default", "configs"];

type ImportedConfig = Record<string, Truck.Configuration>;

async function defineOutput(outputEntry?: string) {
  outputEntry = outputEntry ?? "out";

  const output = path.resolve(process.cwd(), outputEntry);

  try {
    await fs.access(output, fs.constants.R_OK);
  } catch (error) {
    await fs.mkdir(output);
  }

  return output;
}

function isValidConfiguration(configs: Truck.Configuration) {
  return !!(configs && configs.models);
}

const emptyFolders = async (
  folderPath: string,
  data: string[],
  clean?: boolean,
) => {
  try {
    const dirs = await fs.readdir(folderPath);

    const cdirs = misc.compareAndFilter(dirs, data);

    const fdirs = clean ? dirs : cdirs;

    for (const dir of fdirs) {
      const rd = path.resolve(folderPath, dir);

      await fs.rm(rd, { recursive: true, force: true });
    }
  } catch (error) {
    if (isError(error)) {
      const logger = new Logger();

      logger.fail(212, { error: error.message });
      process.exit(0);
    }
    throw error;
  }
};

const makeDirectories = async (...paths: string[]) => {
  try {
    const makers = paths.map(
      async (path) => await fs.mkdir(path, { recursive: true }),
    );

    await Promise.all(makers);
  } catch (error) {
    if (isError(error)) {
      const logger = new Logger();

      logger.fail(212, { error: error.message });
      process.exit(0);
    }
    throw error;
  }
};

class TruckDriver extends Logger {
  private matcher: string;

  constructor() {
    super();

    this.matcher = "**/truck.config.mts";
  }

  private async drive(configs: Truck.Configuration) {
    try {
      const configure = misc.awaited(Builder.configure);

      const configOptions = await configure(configs);

      const data = misc.getKeys(Builder.entries.data);

      const globalOptions = configOptions.globalOptions;

      const clean = misc.cleaner(globalOptions);

      const plugins = configOptions.plugins || [];

      const outputEntry = configOptions.output;

      const out$ = await defineOutput(outputEntry);

      await emptyFolders(out$, data, clean);

      const contents = new TContent(out$);

      const modelMapping = data.map(async (model) => {
        contents.getInstances(model);

        const data$ = Builder.entries.data[model];

        const isArray = Builder.entries.isArray;

        const overrided = parsePlugins(plugins, data$);

        const modelOptions = Builder.modelOptions(model);

        const input = serialize(overrided, { isJSON: false });

        const options = misc.getOptions(globalOptions, modelOptions) ?? {};

        const usetype = misc.canUseTypes(options);

        const contentTarget = path.resolve(out$, model);

        const __type = misc.getType$(model, Builder.types(model));

        const __content = misc.getContent$(model, input, isArray, usetype);

        await makeDirectories(contentTarget);

        const maker = new TDataBuilder(contentTarget);

        const [fData, fType] = await misc.format(__content, __type);

        await Promise.all(
          [maker.type(fType, usetype), maker.data(fData)].filter(Boolean),
        );

        await maker.index(usetype);

        this.success(201, { model });
      });

      await Promise.all(modelMapping);

      await contents.createContentIndex();
    } catch (error) {
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
      throw error;
    }
  }

  public async run() {
    try {
      const [match] = await glob(this.matcher, {
        cwd: process.cwd(),
        absolute: true,
        unique: true,
      });

      if (!match) {
        return this.fail(206);
      }

      const importedConfig: ImportedConfig = await import("file://" + match);

      const proxyHandler = {
        get(target: ImportedConfig, prop: string) {
          if (exportMatchers.includes(prop)) {
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
        return await this.create(configs);
      }

      this.fail(204).message(205, exportMatchers);
    } catch (error) {
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
      throw error;
    }
  }

  async create(configs: Truck.Configuration) {
    function isValidModel(model: Truck.ConfigModel) {
      return Boolean(model.name) && misc.isOptionEnabled(model.schema);
    }

    try {
      const models = misc.parseIterable(configs.models);

      if (models.every(isValidModel)) {
        return await this.drive(configs);
      }

      this.fail(208).message(207);
    } catch (error) {
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
      throw error;
    }
  }
}

export default TruckDriver;
