type NumberWithLength = `number(${number})`;
type NumberErrWithLength = `number(${string})`;

type CharWithLength = `char(${number})`;
type CharErrWithLength = `char(${string})`;

type BoolWithFrequency = `bool(${number})`;
type BoolErrWithFrequency = `bool(${string})`;

type DateFormat = "iso" | "utc";
type DateWithFormat = `date(${DateFormat})`;

export {
  NumberErrWithLength,
  NumberWithLength,
  CharErrWithLength,
  CharWithLength,
  BoolErrWithFrequency,
  BoolWithFrequency,
  DateWithFormat,
};
