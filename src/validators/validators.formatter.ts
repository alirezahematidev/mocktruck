import * as validators from "./index.mjs";

type ValidatorName = keyof typeof validators;

const formatters: Record<ValidatorName, RegExp> = {
  isUUIDFormat:
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  isUrlFormat:
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  isEmailFormat: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:gmail|yahoo)\.com$/,
  isISODate: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
  isUTCDate: /\w+, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/,
};

export default formatters;
