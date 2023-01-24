import configStore from "configstore";
import fs from "node:fs";
import path from "node:path";
import mock from "./mock.json";

const config = new configStore("mock", mock);

console.log(config);
