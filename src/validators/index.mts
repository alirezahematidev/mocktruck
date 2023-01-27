import formatters from "./validators.formatter";

function isUUIDFormat(uuid: string) {
  return formatters.isUUIDFormat.test(uuid);
}

export { isUUIDFormat };
