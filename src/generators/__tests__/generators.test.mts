import * as generators from "../index.mjs";
import * as validators from "@externals";
import describer from "../generators.describer";

describer("generators:generateNumber", () => {
  const fn = jest.fn(generators.generateNumber);

  expect(fn().toString().length).toBe(8);
  expect(fn(-1).toString().length).toBe(8);
  expect(fn(12).toString().length).toBe(12);
  expect(fn(0).toString().length).toBe(8);
  expect(fn(1).toString().length).toBe(1);
  expect(fn(5).toString().length).toBe(5);
});

describer("generators:generateChar", () => {
  const fn = jest.fn(generators.generateChar);

  expect(fn().length).toBe(8);
  expect(fn(-1).length).toBe(8);
  expect(fn(0).length).toBe(8);
  expect(fn(1).length).toBe(1);
  expect(fn(12).length).toBe(12);
  expect(fn(8, "lowercase").toUpperCase() === fn(8, "lowercase")).toBeFalsy();
  expect(fn(8, "uppercase").toLowerCase() === fn(8, "uppercase")).toBeFalsy();
});

describer("generators:generateBool", () => {
  const fn = jest.fn(generators.generateBool);

  expect(fn(0)).toBeFalsy();
  expect(fn(1)).toBeTruthy();
});

describer("generators:generateUUID", () => {
  const fn = jest.fn(generators.generateUUID);
  const formatter = jest.fn(validators.is_uuid_format);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
});

describer("generators:generateEmail", () => {
  const fn = jest.fn(generators.generateEmail);
  const formatter = jest.fn(validators.is_email_format);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(fn().endsWith(".com")).toBeTruthy();
  expect(fn().includes("@")).toBeTruthy();
});

describer("generators:generateURL", () => {
  const fn = jest.fn(generators.generateURL);
  const formatter = jest.fn(validators.is_url_format);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
});

describer("generators:generateISODate", () => {
  const fn = jest.fn(generators.generateISODate);
  const formatter = jest.fn(validators.is_iso_date_format);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
});

describer("generators:generateUTCDate", () => {
  const fn = jest.fn(generators.generateUTCDate);
  const formatter = jest.fn(validators.is_utc_date_format);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
});

describer("generators:generateImage", () => {
  const fn = jest.fn(generators.generateImage);

  expect(fn("200", "300").endsWith("/200/300")).toBeTruthy();
  expect(fn("400").endsWith("/400/400")).toBeTruthy();
});
