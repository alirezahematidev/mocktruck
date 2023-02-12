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
  const mockMap = new Map<any, any>();
  let typeSet: string = "";
  const models = config.models;

  function typeMapping(schema: Truck.Schema): any {
    const properties = Object.keys(schema);

    const b = properties.map((property) => {
      const type = schema[property].type;

      // if (type === "array") {
      //   const s = schema[property] as Truck.ArraySchema;

      //   const length = s.count ?? 10;

      //   // const autoGenerateId = s.autoGenerateId;

      //   const list = Array.from({ length }, () => typeMapping(s.schema));

      //   // if (isOptionEnabled(autoGenerateId)) {
      //   //   const field = autoGenerateId.field ?? "id";

      //   //   const strategy = autoGenerateId.strategy ?? "uuid";

      //   //   /** @todo Non object entities */
      //   //   const isFieldDuplicated = list.find((obj) =>
      //   //     Object.hasOwn(obj, field),
      //   //   );

      //   //   if (!isFieldDuplicated) {
      //   //     function generate(index: number) {
      //   //       if (strategy === "autoincrement") {
      //   //         return index + 1;
      //   //       }

      //   //       return generators.generate_uuid();
      //   //     }

      //   //     const listIncludedId = list.map((obj, index) => ({
      //   //       [field]: generate(index),
      //   //       ...obj,
      //   //     }));

      //   //     return [property, listIncludedId];
      //   //   }
      //   // }

      //   return [property, list];
      // }

      if (type === "object") {
        const s = schema[property] as Truck.ObjectSchema;

        const ra = s.required ? "" : "?";

        return `${property}${ra}:{\n${typeMapping(s.schema)}\n};\n`;
      }

      if (type === "firstname") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "lastname") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "digits") {
        const s = schema[property] as Truck.NumberSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:number ${na};\n`;
      }

      if (type === "date") {
        const s = schema[property] as Truck.DateSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "domain") {
        const s = schema[property] as Truck.InternetSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "email") {
        const s = schema[property] as Truck.InternetSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "fullname") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }
      if (type === "paragraph") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }
      if (type === "sentence") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "uuid") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "word") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "array") {
        const s = schema[property] as Truck.NameSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      return `${property}:unknown;\n`;
    });

    return b.join("");
  }

  function schemaMapping(schema: Truck.Schema): any {
    const properties = Object.keys(schema);

    const a = properties.map((property) => {
      const type = schema[property].type;

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

          return mockMap.set(name, listIncludedId);
        }
      }

      return mockMap.set(name, list);
    }
    console.log({ fff: typeMapping(schema) });
    typeSet += typeMapping(schema);

    // typesMap.set(name, typeMapping(schema));
    mockMap.set(name, schemaMapping(schema));
  });
  const type = typeSet;

  const mock = Object.fromEntries(mockMap.entries());

  return { type, mock };
}

export { configMapping };
