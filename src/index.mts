import configStore from "configstore";
import fs from "node:fs";
import { typeGenerator } from "./utils/type.generator.mjs";

const loadJSON = (path: string) => {
  return JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString());
};

const mock = loadJSON("./mock.json");

const config = new configStore("mock", mock);

typeGenerator(config.all);
