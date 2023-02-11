import * as extractors from "@externals";

function nullish<T>(value: T | undefined): T | null {
  if (!value) return null;

  return value;
}

function numberWithLengthExtract(type: string): number | null {
  const matching = extractors.number_arguments_extract(type);

  return nullish(matching);
}

type CharExtractObject = {
  length: number | null;
  style: string | null;
};

// function charWithLengthExtract(type: string): CharExtractObject | null {
//   const matching = extractors.char_arguments_extract(type);

//   if (!matching) return null;

//   const length = nullish(matching.get_length());

//   const style = nullish(matching.get_style());

//   return {
//     length,
//     style,
//   };
// }

function boolWithFrequencyExtract(type: string): number | null {
  const matching = extractors.bool_arguments_extract(type);

  return nullish(matching);
}

function dateWithFormatExtract(type: string): string | null {
  const matching = extractors.date_arguments_extract(type);

  const format = nullish(matching);

  return format;
}

type ImageSize = {
  width: number;
  height: number;
};

function imageWithSizesExtract(type: string): ImageSize | null {
  const matching = extractors.image_arguments_extract(type);

  if (!matching) return null;

  const DEFAULT_SIZE = 100;

  const width = nullish(matching.get_width()) ?? DEFAULT_SIZE;

  const height = nullish(matching.get_height()) ?? DEFAULT_SIZE;

  return { width, height };
}

export {
  numberWithLengthExtract,
  boolWithFrequencyExtract,
  dateWithFormatExtract,
  imageWithSizesExtract,
};
