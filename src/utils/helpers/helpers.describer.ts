import * as helpers from './index.mjs';

type HelperName = `helpers:${keyof typeof helpers}`;

function describer(name: HelperName, fn?: jest.ProvidesCallback) {
  test(name, fn);
}

export default describer;
