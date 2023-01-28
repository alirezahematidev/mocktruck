import * as extractors from "./index.mjs";

type ExtractorName = keyof typeof extractors;

const extractMapper: Record<ExtractorName, RegExp> = {
  numberWithLengthExtract: /^number\(((\s*)?\d+(\s*)?)\)$/i,
  boolWithFrequencyExtract:
    /^(bool(ean)?\()((\s+)?[0]{1}(\.\d+)?(\s+)?|(\s+)?1(\s+)?)\)$/i,
  charWithLengthExtract: /^char\(\s*(\d+)?\s*,?\s*((upper|lower)case)?\s*\)$/i,
  dateWithFormatExtract: /^date\((\s+)?(iso|utc)(\s+)?\)$/i,
  imageWithSizesExtract: /^image\(((\s+)?\d+(\s+)?(,(\s+)?\d+(\s+)?)*)\)$/,
};

export { extractMapper };
