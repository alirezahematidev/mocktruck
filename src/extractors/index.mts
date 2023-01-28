import { extractMapper } from "./extractors.matcher";

function trim(value: string): string {
  return value.trim();
}

function numberWithLengthExtract(type: string): number | null {
  const matching = extractMapper.numberWithLengthExtract.exec(type);

  if (!matching) return null;

  const matchingAsNumber = Number(trim(matching[1]));

  if (isNaN(matchingAsNumber)) return null;

  return matchingAsNumber;
}

type CharStyle = "uppercase" | "lowercase";

type CharExtractObject = {
  length: number | null;
  style: CharStyle | null;
};

function charWithLengthExtract(type: string): CharExtractObject | null {
  const matching = extractMapper.charWithLengthExtract.exec(type);

  if (!matching || (!matching[1] && !matching[2])) return null;
  let matchingAsNumber: number | null = null;
  let charStyle: CharStyle | null = null;

  const filteredMatching = matching.filter(Boolean).map(trim).filter(Boolean);

  const [_, length, style] = filteredMatching;

  if (length) {
    matchingAsNumber = Number(length);

    if (isNaN(matchingAsNumber)) {
      matchingAsNumber = null;
      charStyle = length.toLowerCase() as CharStyle;
    }
  }

  if (style) {
    if (!isNaN(parseInt(length))) {
      charStyle = style.toLowerCase() as CharStyle;
    }
  }

  return {
    length: matchingAsNumber,
    style: charStyle,
  };
}

function boolWithFrequencyExtract(type: string): number | null {
  const matching = extractMapper.boolWithFrequencyExtract.exec(type);

  if (!matching) return null;

  const filteredMatching = matching
    .filter(Boolean)
    .filter((m) => !isNaN(Number(trim(m))))
    .map(trim)
    .filter(Boolean);

  const matchingAsNumber = Number(filteredMatching[0]);

  if (isNaN(matchingAsNumber)) return null;

  return matchingAsNumber;
}

function dateWithFormatExtract(type: string): "iso" | "utc" | null {
  const matching = extractMapper.dateWithFormatExtract.exec(type);

  if (!matching) return null;

  const filteredMatching = matching.filter(Boolean).map(trim).filter(Boolean);

  if (!filteredMatching[1]) return null;

  const dateFormat = filteredMatching[1].toLowerCase();

  return dateFormat as "iso" | "utc";
}

type ImageSize = {
  width: string;
  height: string;
};

function imageWithSizesExtract(type: string): ImageSize | null {
  const matching = extractMapper.imageWithSizesExtract.exec(type);

  const arraySizeMatcher = /(\s+)?\d+(\s+)?\,(\s+)?\d+(\s+)?/i;

  if (!matching) return null;

  const filteredMatching = matching.filter(Boolean).map(trim).filter(Boolean);

  const sizes = filteredMatching[1];

  if (arraySizeMatcher.test(sizes)) {
    const [width, height] = sizes.split(",").map(trim);

    return {
      width,
      height,
    };
  }

  if (/\d+/i.test(trim(sizes))) {
    return {
      width: sizes,
      height: sizes,
    };
  }

  return null;
}

export {
  numberWithLengthExtract,
  charWithLengthExtract,
  boolWithFrequencyExtract,
  dateWithFormatExtract,
  imageWithSizesExtract,
};
