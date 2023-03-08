import Truck from "../interfaces/index.mjs";
import * as misc from "../misc/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import glob from "fast-glob";
import serialize from "serialize-javascript";
import TContent from "./helpers/contents.mjs";
import TServices from "./helpers/services.mjs";
import TDataBuilder from "./helpers/databuilder.mjs";
import parsePlugins from "./plugin.js";
import Builder from "../generator/index.mjs";
import TApiRequest from "./helpers/api.mjs";
import { __CONTENTS__, __REQUESTS__ } from "../constants/global.constants.mjs";
import { TruckArgs } from "../../cli/types/cli.type.mjs";

const exportMatchers: ReadonlyArray<string> = ["default", "configs"];

type ImportedConfig = Record<string, Truck.Configuration>;

async function defineOutput(target: string) {
  const output = path.resolve(process.cwd(), target);

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
  folderPaths: string[],
  data: string[],
  clean?: boolean,
) => {
  try {
    const removeTasks = folderPaths.map(async (folderPath) => {
      const dirs = await fs.readdir(folderPath);

      const cdirs = misc.compareAndFilter(dirs, data);

      const fdirs = clean ? dirs : cdirs;

      for (const dir of fdirs) {
        const rd = path.resolve(folderPath, dir);

        await fs.rm(rd, { recursive: true, force: true });
      }
    });

    await Promise.all(removeTasks);
  } catch (error) {
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
    throw error;
  }
};

class TruckDriver {
  private matcher: string;
  private args: TruckArgs;

  constructor(args: TruckArgs) {
    this.args = args;

    this.matcher = "**/truck.config.{js,ts,mjs,mts}";
  }

  private async drive(configs: Truck.Configuration) {
    try {
      const configure = misc.awaited(Builder.configure);

      const configOptions = await configure(configs);

      const data = misc.getKeys(Builder.entries.data);

      const globalOptions = configOptions.globalOptions;

      const clean = misc.cleaner(globalOptions);

      const plugins = configOptions.plugins || [];

      const [contentOut, requestOut] = await Promise.all([
        defineOutput(__CONTENTS__),
        defineOutput(__REQUESTS__),
      ]);

      await emptyFolders([contentOut, requestOut], data, clean);

      const contents = new TContent([contentOut, requestOut]);

      const services = new TServices();

      await services.regenerate();

      const modelMapping = data.map(async (model) => {
        contents.getInstances(model);

        const data$ = Builder.entries.data[model];

        const isArray = Builder.entries.isArray;

        const overrided = parsePlugins(plugins, data$);

        const modelOptions = Builder.modelOptions(model);

        const input = serialize(overrided, { isJSON: false });

        const options = misc.getOptions(globalOptions, modelOptions) ?? {};

        const usetype = misc.canUseTypes(options);

        const hash = misc.randomKey(8);

        await services.createConfig(model, input, hash);

        const contentTarget = path.resolve(contentOut, model);

        const requestTarget = path.resolve(requestOut, model);

        const __type = misc.getType$(model, Builder.types(model));

        const __content = misc.getContent$(model, input, isArray, usetype);

        const __api = misc.getApi$(model, isArray);

        await makeDirectories(contentTarget, requestTarget);

        const maker = new TDataBuilder(contentTarget);

        const requests = new TApiRequest(requestTarget);

        const [fData, fType, fApi] = await misc.format(
          [contentOut, __content],
          [contentOut, __type],
          [requestOut, __api],
        );

        await Promise.all([
          maker.type(fType, usetype),
          maker.data(fData),
          requests.type(fType, usetype),
          requests.data(fApi),
        ]);

        await maker.index(usetype);
      });

      await Promise.all(modelMapping);

      await Promise.all([
        contents.createContentIndex(),
        contents.createApiIndex(this.args.port ?? 6969),
        services.define(),
      ]);

      // await services.index(this.args.port ?? 6969);
    } catch (error) {
      throw error;
    }
  }

  public async run() {
    try {
      const [match] = await glob(this.matcher, {
        cwd: process.cwd(),
        absolute: true,
      });

      if (!match) {
        console.log("no configuration file found");
        process.exit(1);
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

      console.log(
        "The configuration must be export default or export name by `configs`",
      );

      process.exit(1);
    } catch (error) {
      console.log(error);
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

      throw new Error(
        "models must have name and schema. beware to defined them in each model",
      );
    } catch (error) {
      console.log("An error occured: " + error);
    } finally {
      await Builder.loggerInstance.save();
    }
  }
}

export default TruckDriver;
