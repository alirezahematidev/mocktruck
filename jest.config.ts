import { defaults } from "jest-config";
import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  silent: false,
  verbose: true,
  detectOpenHandles: true,
  preset: "ts-jest",
  transform: {
    "^.+\\.(mts|mtsx)?$": [
      "ts-jest",
      { isolatedModules: true, tsconfig: "tsconfig.json", useESM: true },
    ],
    "^.+\\.(mjs|mjsx)?$": "babel-jest",
  },
  globals: {
    ...defaults.globals,
  },
  moduleFileExtensions: ["ts", "js", "mts", "mjs"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: ["/node_modules/"],
  testPathIgnorePatterns: [".*/lib/.*", "lib"],
  rootDir: "src",
  testMatch: ["**/__tests__/**/*.mts", "**/__tests__/**/*.mjs"],
  resolver: "<rootDir>/resolvers/mjs-resolver.cjs",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
    useESM: true,
  }),
};

export default config;
