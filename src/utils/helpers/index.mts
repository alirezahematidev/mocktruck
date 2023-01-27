import {
  BoolErrWithFrequency,
  BoolWithFrequency,
  CharErrWithLength,
  CharWithLength,
  DateWithFormat,
  NumberErrWithLength,
  NumberWithLength,
} from "./helpers.type";
import matchers from "./helpers.matcher";

//number annotation
function isNumber(type: string): type is "number" {
  return matchers.isNumber.test(type);
}

function isNumberWithLength(type: string): type is NumberWithLength {
  return matchers.isNumberWithLength.test(type);
}

function isNumberErrWithLength(type: string): type is NumberErrWithLength {
  return matchers.isNumberErrWithLength.test(type);
}

//char annotation
function isChar(type: string): type is "char" {
  return matchers.isChar.test(type);
}

function isCharWithLength(type: string): type is CharWithLength {
  return matchers.isCharWithLength.test(type);
}

function isCharErrWithLength(type: string): type is CharErrWithLength {
  return matchers.isCharErrWithLength.test(type);
}

//bool(ean) annotation
function isBool(type: string): type is "bool" {
  return matchers.isBool.test(type);
}

function isBoolWithFrequency(type: string): type is BoolWithFrequency {
  return matchers.isBoolWithFrequency.test(type);
}

function isBoolErrWithFrequency(type: string): type is BoolErrWithFrequency {
  return matchers.isBoolErrWithFrequency.test(type);
}

//date annotation
function isDate(type: string): type is "date" {
  return matchers.isDate.test(type);
}

function isDateWithFormat(type: string): type is DateWithFormat {
  return matchers.isDateWithFormat.test(type);
}

//uuid annotation
function isUUID(type: string): type is "uuid" {
  return matchers.isUUID.test(type);
}

//url annotation
function isUrl(type: string): type is "url" {
  return matchers.isUrl.test(type);
}

//email annotation
function isEmail(type: string): type is "email" {
  return matchers.isEmail.test(type);
}

//image annotation
function isImage(type: string): type is "image" {
  return matchers.isImage.test(type);
}

export {
  isNumber,
  isNumberWithLength,
  isNumberErrWithLength,
  isChar,
  isCharWithLength,
  isCharErrWithLength,
  isBool,
  isBoolWithFrequency,
  isBoolErrWithFrequency,
  isDate,
  isDateWithFormat,
  isUUID,
  isUrl,
  isEmail,
  isImage,
};
