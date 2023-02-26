import { Truck } from "../interfaces/index.mjs";
import * as misc from "../misc/index.mjs";
import * as gen from "../externals/pkg/index.js";
import * as cons from "../constants/index.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import isEqual from "lodash/isEqual.js";
import { Logger } from "../log/index.mjs";
import { Typing, Generator } from "./helpers/index.mjs";
import { AutoGenerateId } from "./helpers/autoGenerateId.mjs";

class Builder extends AutoGenerateId {
  private static logger = new Logger();
  private static map = new Map<string, Truck.IMock>();
  private static type = new Map<string, Truck.ITypeRecord>();
  private static options: Truck.IOptions = {};
  private static isArray: boolean = false;

  public static get entries() {
    const data = misc.fromMap(Builder.map.entries());
    const isArray = Builder.isArray;

    return Object.freeze({ data, isArray });
  }

  public static types(model: string) {
    const types = misc.fromMap(Builder.type.entries());

    return types[model];
  }

  public static modelOptions(model: string): Truck.Options | undefined {
    const options = Builder.options[model];

    if (!misc.isOptionEnabled(options)) return undefined;

    return options;
  }

  public static get loggerInstance() {
    return Builder.logger;
  }

  static build(schema: Truck.Schema): Truck.IReturnEntries {
    try {
      const generator = new Generator(schema);

      const properties = misc.getKeys<Truck.Schema>(schema);

      const entries = properties.map((property) => {
        const type = schema[property].type;

        switch (type) {
          case "array":
            return generator.array(property, Builder);

          case "object":
            return generator.object(property, Builder);

          case "firstname":
            return generator.char(property, gen.generate_firstname);

          case "lastname":
            return generator.char(property, gen.generate_lastname);

          case "fullname":
            return generator.char(property, gen.generate_fullname);

          case "paragraph":
            return generator.char(property, gen.generate_paragraph);

          case "paragraphs":
            return generator.char(property, gen.generate_paragraphs);

          case "sentence":
            return generator.char(property, gen.generate_sentence);

          case "word":
            return generator.char(property, gen.generate_word);

          case "digits":
            return generator.digit(property);

          case "bigint":
            return generator.bigint(property);

          case "date":
            return generator.date(property);

          case "domain":
            return generator.domain(property);

          case "email":
            return generator.email(property);

          case "uuid":
            return generator.uuid(property);

          case "boolean":
            return generator.bool(property);

          default:
            return generator.default(property);
        }
      }) as Truck.IMapping[];

      return misc.from(entries);
    } catch (error) {
      throw error;
    }
  }

  static typing(schema: Truck.Schema, name: string, distinctTypes?: boolean) {
    try {
      const typeDef = new Typing(schema, name, distinctTypes);

      const typed = Builder.typedProperties(schema);

      const notations: string[] = typed.map(({ property, notation }) => {
        switch (notation) {
          case TypeNotation.STRING:
            return typeDef.make(property).satisfy(notation);

          case TypeNotation.NUMBER:
            return typeDef.make(property).satisfy(notation);

          case TypeNotation.BIGINT:
            return typeDef.make(property).satisfy(notation);

          case TypeNotation.BOOL:
            return typeDef.make(property).satisfy(notation);

          case TypeNotation.OBJECT:
            return typeDef
              .make(property)
              .struct(Builder, schema[property] as Truck.TStruct);

          case TypeNotation.ARRAY:
            return typeDef
              .make(property)
              .list(Builder, schema[property] as Truck.TArray);

          default:
            return typeDef.make(property).satisfy(TypeNotation.UNKNOWN);
        }
      });

      return notations.filter(Boolean).join("");
    } catch (error) {
      throw error;
    }
  }

  static iterate(
    models: Truck.ConfigModel[],
    globalOptions?: Truck.GlobalOptions,
  ) {
    try {
      Builder.isArray = false;

      models.forEach((model) => {
        const name = model.name;

        const options = model.options ?? {};

        const schema = model.schema;

        const listOptions = options.listOptions;

        Builder.declareOptions(name, options);

        const mergedOptions = misc.getOptions(globalOptions, options) ?? {};

        if (misc.isOptionEnabled(listOptions)) {
          Builder.isArray = true;

          const length = listOptions.count ?? cons.LENGTH;

          const autoGenerateId = listOptions.autoGenerateId;

          const list = misc.list(length, () => Builder.build(schema));

          if (!misc.isOptionEnabled(autoGenerateId)) {
            Builder.extendType(
              name,
              Builder.typing(schema, name, mergedOptions.distinctTypes),
            );

            return Builder.update(name, list);
          }
          const mappedList = this.generate(list, autoGenerateId);

          const modifiedTyping = misc.optionsListType(
            Builder.typing(schema, name, mergedOptions.distinctTypes),
            listOptions,
          );

          Builder.extendType(name, modifiedTyping);

          return Builder.update(name, mappedList || list);
        }

        Builder.extendType(
          name,
          Builder.typing(schema, name, mergedOptions.distinctTypes),
        );

        Builder.update(name, Builder.build(schema));
      });
    } catch (error) {
      throw error;
    }
  }

  static configure(configs: Truck.Configuration): Truck.ConfigurationOptions {
    try {
      const models = configs.models;

      const globalOptions = configs.globalOptions;

      Builder.iterate(misc.parseIterable(models), globalOptions);

      return configs;
    } catch (error) {
      throw error;
    }
  }

  public static refTyping(model: string, ref: Truck.TypeReference) {
    if (!Builder.type.has(model)) {
      Builder.type.set(model, {
        infer: cons.EMPTY,
        reference: new Map<string, string>(),
      });
    }

    const record = Builder.type.get(model);

    if (!record) return;

    const { key, value } = misc.mapObject(ref);

    record.reference.set(key, value);
  }

  private static extendType(model: string, type: string) {
    if (!Builder.type.has(model)) {
      Builder.type.set(model, {
        infer: cons.EMPTY,
        reference: new Map<string, string>(),
      });
    }

    const record = Builder.type.get(model);

    if (!record) return;

    if (record.infer === undefined) {
      record.infer = cons.EMPTY;
    }

    record.infer += type;
  }

  private static declareOptions(name: string, options: Truck.Options) {
    Builder.options[name] = options;
  }

  private static update(name: string, entries: Truck.IMock) {
    const prevEnteries = Builder.map.get(name);

    const equal = isEqual(prevEnteries, entries);

    if (equal) return;

    Builder.map.set(name, entries);
  }

  private static typedProperties(schema: Truck.Schema): Truck.TypedProperty[] {
    const properties = misc.getKeys(schema);

    return properties.map((property) => {
      const type = schema[property].type;

      switch (type) {
        case "firstname":
        case "lastname":
        case "fullname":
        case "date":
        case "domain":
        case "email":
        case "paragraph":
        case "paragraphs":
        case "sentence":
        case "uuid":
        case "word":
          return { property, notation: TypeNotation.STRING };

        case "boolean":
          return { property, notation: TypeNotation.BOOL };

        case "digits":
          return { property, notation: TypeNotation.NUMBER };

        case "bigint":
          return { property, notation: TypeNotation.BIGINT };

        case "object":
          return { property, notation: TypeNotation.OBJECT };

        case "array":
          return { property, notation: TypeNotation.ARRAY };

        default:
          return { property, notation: TypeNotation.UNKNOWN };
      }
    });
  }
}

type TBuilder = typeof Builder;

export { Builder };

export type { TBuilder };
