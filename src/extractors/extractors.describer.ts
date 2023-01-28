import * as extractors from "./index.mjs";

type ExtractorName = `extractors:${keyof typeof extractors}`;

function describer(name: ExtractorName, fn?: jest.ProvidesCallback) {
  test(name, fn);
}

export default describer;
