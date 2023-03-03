import * as misc from "../misc/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import glob from "glob";
import serialize from "serialize-javascript";
import TContent from "./helpers/contents.mjs";
import TServices from "./helpers/services.mjs";
import TDataBuilder from "./helpers/databuilder.mjs";
import parsePlugins from "./plugin.js";
import Truck from "../interfaces/index.mjs";
import Builder from "../generator/index.mjs";
import TApiRequest from "./helpers/api.mjs";

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

const $root = process.cwd();

async function defineOutput(target: string) {
  const output = path.resolve($root, target);

  try {
    await fs.access(output, fs.constants.R_OK);
  } catch (error) {
    await fs.mkdir(output);
  }

  return output;
}

async function truck$(configs: Truck.Configuration) {
  try {
    const configure = misc.awaited(Builder.configure);

    const configOptions = await configure(configs);

    const globalOptions = configOptions.globalOptions;

    const clean = misc.cleaner(globalOptions);

    const plugins = configOptions.plugins || [];

    const [cout, rout] = await Promise.all([
      defineOutput("contents"),
      defineOutput("requests"),
    ]);

    const data = misc.getKeys(Builder.entries.data);

    const emptyFolder = async (folderPath: string) => {
      const dirs = await fs.readdir(folderPath);

      const cdirs = misc.compareAndFilter(dirs, data);

      const fdirs = clean ? dirs : cdirs;

      for (const dir of fdirs) {
        const rd = path.resolve(folderPath, dir);

        await fs.rm(rd, { recursive: true, force: true });
      }
    };

    await Promise.all([emptyFolder(cout), emptyFolder(rout)]);

    const contents = new TContent([cout, rout]);

    const services = new TServices();

    await services.regenerate();

    const dataList = data.map(async (model) => {
      const $data = Builder.entries.data[model];

      const isArray = Builder.entries.isArray;

      const overridesData = parsePlugins(plugins, $data);

      const modelOptions = Builder.modelOptions(model);

      const input = serialize(overridesData, { isJSON: false });

      const options = misc.getOptions(globalOptions, modelOptions) ?? {};

      const usetype$ = misc.canUseTypes(options);

      const type$ = misc.getType$(model, Builder.types(model));

      const content$ = misc.getContent$({
        model,
        input,
        isArray,
        usetype$,
      });

      const api$ = misc.getApi$(model, isArray);

      contents.getInstances(model);

      const key = misc.randomKey(8);

      await services.createConfig(model, input, key);

      const ctarget = path.resolve(cout, model);

      const rtarget = path.resolve(rout, model);

      await Promise.all([
        fs.mkdir(ctarget, { recursive: true }),
        fs.mkdir(rtarget, { recursive: true }),
      ]);

      const maker = new TDataBuilder(ctarget);

      const requests = new TApiRequest(rtarget);

      const [fdata, ftype, fapi] = await misc.format(
        [cout, content$],
        [cout, type$],
        [rout, api$],
      );

      await Promise.all([
        maker.type(ftype, usetype$),
        maker.data(fdata),
        requests.type(ftype, usetype$),
        requests.data(fapi),
      ]);

      await maker.index(usetype$);
    });

    await Promise.all(dataList);

    await Promise.all([
      contents.createContentIndex(),
      contents.createApiIndex(6969),
      services.define(),
    ]);
  } catch (error) {
    throw error;
  }
}

glob("**/truck.config.{js,ts,mjs,mts}", globOptions, (err, matches) => {
  if (err) throw err;

  let immediate$: NodeJS.Immediate;

  if (!matches || !matches.length) {
    console.log("no configuration file found");
    process.exit(1);
  }

  if (matches.length > 1) {
    console.log("multiple configuration files found. please provide one");
    process.exit(1);
  }

  immediate$ = setImmediate(async () => {
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
      clearImmediate(immediate$);
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
      return await truck$(configs);
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
