import * as generators from "../index.mjs";
import * as validators from "../../validators/index.mjs";
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
  const formatter = jest.fn(validators.isUUIDFormat);

  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
  expect(formatter(fn())).toBeTruthy();
});
