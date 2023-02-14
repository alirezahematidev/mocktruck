import { Truck } from "../interfaces/index.mjs";
import { isArray, parseIterable } from "../misc/index.mjs";
import { Builder } from "./builder.mjs";

function configMapping(config: Truck.Configuration) {
  // const mockMap = new Map<any, any>();
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
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "lastname") {
        const s = schema[property] as Truck.CharSchema;

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
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }
      if (type === "paragraph") {
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }
      if (type === "sentence") {
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "uuid") {
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "word") {
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      if (type === "array") {
        const s = schema[property] as Truck.CharSchema;

        const ra = s.required ? "" : "?";
        const na = s.nullable ? "| null" : "";

        return `${property}${ra}:string ${na};\n`;
      }

      return `${property}:unknown;\n`;
    });

    return b.join("");
  }

  Builder.iterate(parseIterable(models));

  // models.forEach((model) => {
  //   const name = model.name;

  //   const options = model.options ?? {};

  //   const schema = model.schema;

  //   const listOptions = options.listOptions;

  //   if (isOptionEnabled(listOptions)) {
  //     const length = listOptions.count ?? 10;

  //     const autoGenerateId = listOptions.autoGenerateId;

  //     const list = Array.from({ length }, () => schemaMapping(schema));

  //     if (isOptionEnabled(autoGenerateId)) {
  //       const field = autoGenerateId.field ?? "id";

  //       const strategy = autoGenerateId.strategy ?? "uuid";

  //       /** @todo Non object entities */
  //       const isFieldDuplicated = list.find((obj) => Object.hasOwn(obj, field));

  //       if (!isFieldDuplicated) {
  //         function generate(index: number) {
  //           if (strategy === "autoincrement") {
  //             return index + 1;
  //           }

  //           return generators.generate_uuid();
  //         }

  //         const listIncludedId = list.map((obj, index) => ({
  //           [field]: generate(index),
  //           ...obj,
  //         }));

  //         return mockMap.set(name, listIncludedId);
  //       }
  //     }

  //     return mockMap.set(name, list);
  //   }
  //   console.log({ fff: typeMapping(schema) });
  //   typeSet += typeMapping(schema);

  //   // typesMap.set(name, typeMapping(schema));
  //   mockMap.set(name, schemaMapping(schema));
  // });
  const type = typeSet;

  const mock = Builder.mock();

  return { type, mock };
}

export { configMapping };
