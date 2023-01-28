import * as helpers from "./index.mjs";

type HelperName = keyof typeof helpers;

const matchers: Record<HelperName, RegExp> = {
  isNumber: /^(\?)?number$/i,
  isNumberWithLength: /^(\?)?number\((\s*)?\d+(\s*)?\)$/i,
  isNumberErrWithLength: /^(\?)?number\((\s*)?\D+(\s*)?\)$/i,
  isChar: /^(\?)?char$/i,
  isCharWithLength:
    /^(\?)?char\((((\s*)?\d+(\s*)?|((\s*)?lower|upper)case(\s*)?)|((\s*)?\d+(\s+)?\,(\s+)?((\s*)?lower|upper)case)(\s*)?)\)$/i,
  isCharErrWithLength: /^(\?)?char\(((?!(lower|upper)case)\D+)\)$/i,
  isBool: /^(\?)?(bool(ean)?)$/i,
  isBoolWithFrequency: /^(\?)?(bool(ean)?)\(([0]{1}(\.\d+)?|1)\)?$/i,
  isBoolErrWithFrequency: /^(\?)?(bool(ean)?)\(([a-z]+(\.\D+)?|[a-z])\)?$/i,
  isDate: /^(\?)?date$/i,
  isDateWithFormat: /^(\?)?date\((iso|utc)\)$/i,
  isUUID: /^(\?)?uuid$/i,
  isUrl: /^(\?)?url$/i,
  isEmail: /^(\?)?email$/i,
  isImage: /^(\?)?image\(\d+((\s+)?\,(\s+)?\d+)?\)$/i,
};

export default matchers;
