import * as extractors from "../index.mjs";
import describer from "../extractors.describer";

describer("extractors:numberWithLengthExtract", () => {
  const fn = jest.fn(extractors.numberWithLengthExtract);

  expect(fn("number(53)")).toBe(53);
  expect(fn("number(53   )")).toBe(53);
  expect(fn("number(   53)")).toBe(53);
  expect(fn("number(   53   )")).toBe(53);
  expect(fn("NUMBER(53)")).toBe(53);
  expect(fn("number(0)")).toBe(0);
  expect(fn("number(123)")).toBe(123);
  expect(fn("number()")).toBeNull();
  expect(fn("number(ab)")).toBeNull();
});

describer("extractors:charWithLengthExtract", () => {
  const fn = jest.fn(extractors.charWithLengthExtract);

  expect(fn("char(53,uppercase)")).toStrictEqual({
    length: 53,
    style: "uppercase",
  });

  expect(fn("char(53,   uppercase)")).toStrictEqual({
    length: 53,
    style: "uppercase",
  });

  expect(fn("char(53    ,uppercase)")).toStrictEqual({
    length: 53,
    style: "uppercase",
  });

  expect(fn("char(53    ,    uppercase)")).toStrictEqual({
    length: 53,
    style: "uppercase",
  });

  expect(fn("char(  53    ,    uppercase  )")).toStrictEqual({
    length: 53,
    style: "uppercase",
  });

  expect(fn("char(4,lowercase)")).toStrictEqual({
    length: 4,
    style: "lowercase",
  });

  expect(fn("char(25)")).toStrictEqual({
    length: 25,
    style: null,
  });

  expect(fn("char(lowercase)")).toStrictEqual({
    length: null,
    style: "lowercase",
  });

  expect(fn("char(UPPERCASE)")).toStrictEqual({
    length: null,
    style: "uppercase",
  });

  expect(fn("char()")).toBeNull();
});

describer("extractors:boolWithFrequencyExtract", () => {
  const fn = jest.fn(extractors.boolWithFrequencyExtract);

  expect(fn("bool(1)")).toBe(1);
  expect(fn("boolean(0)")).toBe(0);
  expect(fn("bool(0.42   )")).toBe(0.42);
  expect(fn("bool(   0.42)")).toBe(0.42);
  expect(fn("bool(   0.42   )")).toBe(0.42);
  expect(fn("BOOL(0.42)")).toBe(0.42);
  expect(fn("bool()")).toBeNull();
  expect(fn("bool(-1)")).toBeNull();
  expect(fn("bool(1.5)")).toBeNull();
  expect(fn("bool( )")).toBeNull();
  expect(fn("boolean()")).toBeNull();
  expect(fn("bool(ab)")).toBeNull();
});

describer("extractors:dateWithFormatExtract", () => {
  const fn = jest.fn(extractors.dateWithFormatExtract);

  expect(fn("date(iso)")).toBe("iso");
  expect(fn("date(utc)")).toBe("utc");
  expect(fn("date(ISO)")).toBe("iso");
  expect(fn("date(    iso)")).toBe("iso");
  expect(fn("date(iso   )")).toBe("iso");
  expect(fn("date(   iso   )")).toBe("iso");
  expect(fn("date()")).toBeNull();
  expect(fn("date( )")).toBeNull();
});

describer("extractors:imageWithSizesExtract", () => {
  const fn = jest.fn(extractors.imageWithSizesExtract);

  expect(fn("image(200,300)")).toStrictEqual({ width: "200", height: "300" });
  expect(fn("image(200 , 300)")).toStrictEqual({
    width: "200",
    height: "300",
  });
  expect(fn("image(200)")).toStrictEqual({ width: "200", height: "200" });
  expect(fn("image(200   )")).toStrictEqual({ width: "200", height: "200" });
  expect(fn("image(   200)")).toStrictEqual({ width: "200", height: "200" });
  expect(fn("image(  200   )")).toStrictEqual({ width: "200", height: "200" });
  expect(fn("image()")).toBeNull();
  expect(fn("image( )")).toBeNull();
});
