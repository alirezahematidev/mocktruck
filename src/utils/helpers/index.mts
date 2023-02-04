import {
  BoolErrWithFrequency,
  BoolWithFrequency,
  CharWithLength,
  DateWithFormat,
  NumberErrWithLength,
  NumberWithLength,
} from "./helpers.type";
import * as matchers from "@externals";

//number annotation
function isNumber(type: string): type is "number" {
  return matchers.is_number(type);
}

function isNumberWithLength(type: string): type is NumberWithLength {
  return matchers.is_number_with_len(type);
}

function isNumberErrWithLength(type: string): type is NumberErrWithLength {
  return matchers.is_number_err_with_len(type);
}

//char annotation
function isChar(type: string): type is "char" {
  return matchers.is_char(type);
}

function isCharWithLength(type: string): type is CharWithLength {
  return matchers.is_char_with_len(type);
}

//bool(ean) annotation
function isBool(type: string): type is "bool" {
  return matchers.is_bool(type);
}

function isBoolWithFrequency(type: string): type is BoolWithFrequency {
  return matchers.is_bool_with_freq(type);
}

function isBoolErrWithFrequency(type: string): type is BoolErrWithFrequency {
  return matchers.is_bool_err_with_freq(type);
}

//date annotation
function isDate(type: string): type is "date" {
  return matchers.is_date(type);
}

function isDateWithFormat(type: string): type is DateWithFormat {
  return matchers.is_date_with_format(type);
}

//uuid annotation
function isUUID(type: string): type is "uuid" {
  return matchers.is_uuid(type);
}

//url annotation
function isUrl(type: string): type is "url" {
  return matchers.is_url(type);
}

//email annotation
function isEmail(type: string): type is "email" {
  return matchers.is_email(type);
}

//image annotation
function isImage(type: string): type is "image" {
  return matchers.is_image(type);
}

export {
  isNumber,
  isNumberWithLength,
  isNumberErrWithLength,
  isChar,
  isCharWithLength,
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
