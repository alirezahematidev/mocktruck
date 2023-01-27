import * as validators from "./index.mjs";

type ValidatorName = keyof typeof validators;

const formatters: Record<ValidatorName, RegExp> = {
  isUUIDFormat:
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export default formatters;
