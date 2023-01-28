import describer from "../helpers.describer.js";
import * as helpers from "../index.mjs";

describer("helpers:isNumber", () => {
  const fn = jest.fn(helpers.isNumber);

  expect(fn("number")).toBeTruthy();
  expect(fn("?number")).toBeTruthy();
  expect(fn("NUMBER")).toBeTruthy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number(")).toBeFalsy();
});

describer("helpers:isNumberWithLength", () => {
  const fn = jest.fn(helpers.isNumberWithLength);

  expect(fn("number(52)")).toBeTruthy();
  expect(fn("number(52    )")).toBeTruthy();
  expect(fn("number(    52)")).toBeTruthy();
  expect(fn("number(    52    )")).toBeTruthy();
  expect(fn("NUMBER(52)")).toBeTruthy();
  expect(fn("?number(52)")).toBeTruthy();
  expect(fn("number(ab)")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("number(")).toBeFalsy();
  expect(fn("number()")).toBeFalsy();
});

describer("helpers:isNumberErrWithLength", () => {
  const fn = jest.fn(helpers.isNumberErrWithLength);

  expect(fn("number(ab)")).toBeTruthy();
  expect(fn("?number(ab    )")).toBeTruthy();
  expect(fn("?number(    ab)")).toBeTruthy();
  expect(fn("?number(   ab   )")).toBeTruthy();
  expect(fn("NUMBER(ab)")).toBeTruthy();
  expect(fn("number(52)")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("number(")).toBeFalsy();
  expect(fn("number()")).toBeFalsy();
});

describer("helpers:isChar", () => {
  const fn = jest.fn(helpers.isChar);

  expect(fn("char")).toBeTruthy();
  expect(fn("?char")).toBeTruthy();
  expect(fn("CHAR")).toBeTruthy();
  expect(fn("number")).toBeFalsy();
  expect(fn("char(")).toBeFalsy();
});

describer("helpers:isCharWithLength", () => {
  const fn = jest.fn(helpers.isCharWithLength);

  expect(fn("char(52)")).toBeTruthy();
  expect(fn("char(   52)")).toBeTruthy();
  expect(fn("char(52   )")).toBeTruthy();
  expect(fn("char(    52   )")).toBeTruthy();
  expect(fn("char(lowercase)")).toBeTruthy();
  expect(fn("char(   lowercase)")).toBeTruthy();
  expect(fn("char(lowercase    )")).toBeTruthy();
  expect(fn("char(    lowercase  )")).toBeTruthy();
  expect(fn("char(uppercase)")).toBeTruthy();
  expect(fn("char(LOWERCASE)")).toBeTruthy();
  expect(fn("char(25,lowercase)")).toBeTruthy();
  expect(fn("char(25,lowercase  )")).toBeTruthy();
  expect(fn("char( 25,lowercase)")).toBeTruthy();
  expect(fn("char(   25,lowercase  )")).toBeTruthy();
  expect(fn("char(   25 ,lowercase  )")).toBeTruthy();
  expect(fn("char(   25, lowercase  )")).toBeTruthy();
  expect(fn("char(   25 , lowercase  )")).toBeTruthy();
  expect(fn("char(25,uppercase)")).toBeTruthy();
  expect(fn("?char(52)")).toBeTruthy();
  expect(fn("CHAR(52)")).toBeTruthy();
  expect(fn("char(ab)")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("char(")).toBeFalsy();
  expect(fn("char()")).toBeFalsy();
  expect(fn("char(  )")).toBeFalsy();
});

describer("helpers:isCharErrWithLength", () => {
  const fn = jest.fn(helpers.isCharErrWithLength);

  expect(fn("char(ab)")).toBeTruthy();
  expect(fn("?char(ab)")).toBeTruthy();
  expect(fn("CHAR(ab)")).toBeTruthy();
  expect(fn("char(lowercase)")).toBeFalsy();
  expect(fn("char(uppercase)")).toBeFalsy();
  expect(fn("char(52)")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("char(")).toBeFalsy();
  expect(fn("char()")).toBeFalsy();
});

describer("helpers:isBool", () => {
  const fn = jest.fn(helpers.isBool);

  expect(fn("bool")).toBeTruthy();
  expect(fn("?bool")).toBeTruthy();
  expect(fn("BOOL")).toBeTruthy();
  expect(fn("boolean")).toBeTruthy();
  expect(fn("?boolean")).toBeTruthy();
  expect(fn("BOOLEAN")).toBeTruthy();
  expect(fn("boolean(")).toBeFalsy();
  expect(fn("bool(")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
});

describer("helpers:isBoolWithFrequency", () => {
  const fn = jest.fn(helpers.isBoolWithFrequency);

  expect(fn("bool(0)")).toBeTruthy();
  expect(fn("?bool(0)")).toBeTruthy();
  expect(fn("BOOL(0)")).toBeTruthy();
  expect(fn("boolean(0)")).toBeTruthy();
  expect(fn("?boolean(0)")).toBeTruthy();
  expect(fn("BOOLEAN(0)")).toBeTruthy();
  expect(fn("bool(0.4)")).toBeTruthy();
  expect(fn("boolean(0.4)")).toBeTruthy();
  expect(fn("bool(0.465)")).toBeTruthy();
  expect(fn("boolean(0.465)")).toBeTruthy();
  expect(fn("bool(1)")).toBeTruthy();
  expect(fn("boolean(1)")).toBeTruthy();
  expect(fn("bool")).toBeFalsy();
  expect(fn("boolean")).toBeFalsy();
  expect(fn("bool()")).toBeFalsy();
  expect(fn("boolean()")).toBeFalsy();
  expect(fn("bool(1.2)")).toBeFalsy();
  expect(fn("boolean(1.2)")).toBeFalsy();
  expect(fn("bool(0.)")).toBeFalsy();
  expect(fn("boolean(0.)")).toBeFalsy();
  expect(fn("bool(.1)")).toBeFalsy();
  expect(fn("boolean(.1)")).toBeFalsy();
});

describer("helpers:isBoolErrWithFrequency", () => {
  const fn = jest.fn(helpers.isBoolErrWithFrequency);

  expect(fn("bool(ab)")).toBeTruthy();
  expect(fn("?bool(ab)")).toBeTruthy();
  expect(fn("BOOL(ab)")).toBeTruthy();
  expect(fn("boolean(ab)")).toBeTruthy();
  expect(fn("?boolean(ab)")).toBeTruthy();
  expect(fn("BOOLEAN(ab)")).toBeTruthy();
  expect(fn("bool(0)")).toBeFalsy();
  expect(fn("boolean(1)")).toBeFalsy();
  expect(fn("bool(0.4)")).toBeFalsy();
  expect(fn("boolean(.4)")).toBeFalsy();
  expect(fn("bool")).toBeFalsy();
  expect(fn("boolean")).toBeFalsy();
});

describer("helpers:isDate", () => {
  const fn = jest.fn(helpers.isDate);

  expect(fn("date")).toBeTruthy();
  expect(fn("?date")).toBeTruthy();
  expect(fn("DATE")).toBeTruthy();
  expect(fn("date(")).toBeFalsy();
  expect(fn("date()")).toBeFalsy();
  expect(fn("char")).toBeFalsy();
  expect(fn("number")).toBeFalsy();
  expect(fn("bool")).toBeFalsy();
  expect(fn("boolean")).toBeFalsy();
});

describer("helpers:isDateWithFormat", () => {
  const fn = jest.fn(helpers.isDateWithFormat);

  expect(fn("date(iso)")).toBeTruthy();
  expect(fn("?date(iso)")).toBeTruthy();
  expect(fn("DATE(utc)")).toBeTruthy();
  expect(fn("date(ISO)")).toBeTruthy();
  expect(fn("DATE")).toBeFalsy();
  expect(fn("date")).toBeFalsy();
  expect(fn("date(")).toBeFalsy();
  expect(fn("date(ab)")).toBeFalsy();
});

describer("helpers:isUUID", () => {
  const fn = jest.fn(helpers.isUUID);

  expect(fn("uuid")).toBeTruthy();
  expect(fn("UUID")).toBeTruthy();
  expect(fn("?uuid")).toBeTruthy();
  expect(fn("uuid(")).toBeFalsy();
});

describer("helpers:isUrl", () => {
  const fn = jest.fn(helpers.isUrl);

  expect(fn("url")).toBeTruthy();
  expect(fn("URL")).toBeTruthy();
  expect(fn("?url")).toBeTruthy();
  expect(fn("url(")).toBeFalsy();
});

describer("helpers:isEmail", () => {
  const fn = jest.fn(helpers.isEmail);

  expect(fn("email")).toBeTruthy();
  expect(fn("EMAIL")).toBeTruthy();
  expect(fn("?email")).toBeTruthy();
  expect(fn("email(")).toBeFalsy();
});

describer("helpers:isImage", () => {
  const fn = jest.fn(helpers.isImage);

  expect(fn("image(200)")).toBeTruthy();
  expect(fn("?image(200)")).toBeTruthy();
  expect(fn("IMAGE(200)")).toBeTruthy();
  expect(fn("image(200, 400)")).toBeTruthy();
  expect(fn("image(200 ,400)")).toBeTruthy();
  expect(fn("image(200 , 400)")).toBeTruthy();
  expect(fn("IMAGE(200,400)")).toBeTruthy();
  expect(fn("image(200,400,100)")).toBeFalsy();
  expect(fn("image()")).toBeFalsy();
  expect(fn("image")).toBeFalsy();
  expect(fn("image(")).toBeFalsy();
});
