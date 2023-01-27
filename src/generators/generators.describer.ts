import * as generators from "./index.mjs";

type HelperName = `generators:${keyof typeof generators}`;

function describer(name: HelperName, fn?: jest.ProvidesCallback) {
  test(name, fn);
}

export default describer;
