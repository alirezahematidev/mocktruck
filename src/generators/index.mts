import * as generators from "../externals/pkg/index.js";
import { Truck } from "../interfaces/index.mjs";

function isOptionEnabled<P extends Object>(obj: P | undefined): obj is P {
  return Boolean(obj && Object.keys(obj).length !== 0);
}

/** @todo Rewrite this in rust */
function casedString(
  value: string,
  cs?: "uppercase" | "lowercase" | "capitalize",
) {
  if (!cs) return value;

  let _value = value;

  if (cs === "lowercase") {
    _value = value.slice().toLowerCase();
  }

  if (cs === "uppercase") {
    _value = value.slice().toUpperCase();
  }

  if (cs === "capitalize") {
    _value = value;
  }

  return _value;
}

function configMapping(config: Truck.Configuration) {
  const result = new Map<any, any>();
  const models = config.models;

  function schemaMapping(schema: Truck.Schema): any {
    const properties = Object.keys(schema);

    const a = properties.map((property) => {
      const type = schema[property].type;

      if (type === "firstname") {
        const s = schema[property] as Truck.NameSchema;

        let firstname = generators.generate_firstname();

        const casedFirstname = casedString(firstname, s.case);

        return [property, casedFirstname];
      }

      if (type === "lastname") {
        const s = schema[property] as Truck.NameSchema;

        let lastname = generators.generate_lastname();

        const casedLastname = casedString(lastname, s.case);

        return [property, casedLastname];
      }

      if (type === "digits") {
        const s = schema[property] as Truck.NumberSchema;

        return [
          property,
          Number.parseInt(generators.generate_number(s.length || 8).toString()),
        ];
      }

      if (type === "array") {
        const s = schema[property] as Truck.ArraySchema;

        const length = s.count ?? 10;

        const autoGenerateId = s.autoGenerateId;

        const list = Array.from({ length }, () => schemaMapping(s.schema));

        if (isOptionEnabled(autoGenerateId)) {
          const field = autoGenerateId.field ?? "id";

          const strategy = autoGenerateId.strategy ?? "uuid";

          /** @todo Non object entities */
          const isFieldDuplicated = list.find((obj) =>
            Object.hasOwn(obj, field),
          );

          if (!isFieldDuplicated) {
            function generate(index: number) {
              if (strategy === "autoincrement") {
                return index + 1;
              }

              return generators.generate_uuid();
            }

            const listIncludedId = list.map((obj, index) => ({
              [field]: generate(index),
              ...obj,
            }));

            return [property, listIncludedId];
          }
        }

        return [property, list];
      }

      if (type === "object") {
        const s = schema[property] as Truck.ObjectSchema;

        return [property, schemaMapping(s.schema)];
      }

      if (type === "date") {
        const s = schema[property] as Truck.DateSchema;

        const format = s.format;

        let randomDate = "";

        if (format === "UTC") {
          randomDate = generators.generate_utc_date();
        } else {
          randomDate = generators.generate_iso_date();
        }

        return [property, randomDate];
      }

      return [property, generators[`generate_${type}`]()];
    });

    return Object.fromEntries(a);
  }

  models.forEach((model) => {
    const name = model.name;

    const options = model.options ?? {};

    const schema = model.schema;

    const listOptions = options.listOptions;

    if (isOptionEnabled(listOptions)) {
      const length = listOptions.count ?? 10;

      const autoGenerateId = listOptions.autoGenerateId;

      const list = Array.from({ length }, () => schemaMapping(schema));

      if (isOptionEnabled(autoGenerateId)) {
        const field = autoGenerateId.field ?? "id";

        const strategy = autoGenerateId.strategy ?? "uuid";

        /** @todo Non object entities */
        const isFieldDuplicated = list.find((obj) => Object.hasOwn(obj, field));

        if (!isFieldDuplicated) {
          function generate(index: number) {
            if (strategy === "autoincrement") {
              return index + 1;
            }

            return generators.generate_uuid();
          }

          const listIncludedId = list.map((obj, index) => ({
            [field]: generate(index),
            ...obj,
          }));

          return result.set(name, listIncludedId);
        }
      }

      return result.set(name, list);
    }

    result.set(name, schemaMapping(schema));
  });
  return Object.fromEntries(result.entries());
}

export { configMapping };
