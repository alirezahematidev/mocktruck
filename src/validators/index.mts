import formatters from "./validators.formatter";

function isUUIDFormat(uuid: string) {
  return formatters.isUUIDFormat.test(uuid);
}

function isUrlFormat(url: string) {
  return formatters.isUrlFormat.test(url);
}

function isEmailFormat(email: string) {
  return formatters.isEmailFormat.test(email);
}

function isISODate(date: string) {
  return formatters.isISODate.test(date);
}

function isUTCDate(date: string) {
  return formatters.isUTCDate.test(date);
}

export { isUUIDFormat, isUrlFormat, isEmailFormat, isISODate, isUTCDate };
