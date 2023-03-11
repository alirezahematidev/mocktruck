import Truck from "../interfaces/index.js";
import * as misc from "../misc/index.mjs";
import * as cons from "../constants/index.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import isEqual from "lodash/isEqual.js";
import { Typing, MockBuilder } from "./helpers/index.mjs";
import { AutoGenerateId } from "./helpers/autoGenerateId.mjs";
import isError from "lodash/isError.js";
import Logger from "../log/index.mjs";
import { faker } from "@faker-js/faker";
import { intOptions } from "./helpers/utils.mjs";
import { matchers } from "../interfaces/interface.matcher.mjs";

type ValueType = Truck.SchemaOptions["type"];

type MatchType = { readonly type: string };

type Match<T extends MatchType, R extends string> = Exclude<T["type"], R>;

class Builder extends AutoGenerateId {
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

  private static match<T extends MatchType, R extends string = never>(
    arr: readonly Match<T, R>[],
    val: ValueType,
  ): val is Extract<ValueType, Match<T, R>> {
    return arr.includes(val as Match<T, R>);
  }

  static build(schema: Truck.Schema): Truck.IReturnEntries {
    try {
      const generator = new MockBuilder(schema);

      const properties = misc.getKeys<Truck.Schema>(schema);

      const entries = properties.map((property) => {
        const type = schema[property].type;

        if (Builder.match<Truck.TArray>(matchers.array, type)) {
          return generator.array(property, Builder);
        }

        if (Builder.match<Truck.TStruct>(matchers.object, type)) {
          return generator.object(property, Builder);
        }

        if (Builder.match<Truck.TName>(matchers.name, type)) {
          const s = schema[property] as Truck.TName;

          if (type === "fullName") {
            return [property, faker.name[type]({ sex: s.gender })];
          }

          return [property, faker.name[type](s.gender)];
        }

        if (Builder.match<Truck.TBool>(matchers.boolean, type)) {
          return [property, faker.datatype[type]()];
        }

        if (Builder.match<Truck.TInteger>(matchers.integer, type)) {
          const s = schema[property] as Truck.TInteger;

          const range = intOptions(s.length);

          return [property, faker.datatype[type](range)];
        }

        if (Builder.match<Truck.TDate>(matchers.date, type)) {
          const s = schema[property] as Truck.TDate;

          const from = "2000-01-01T00:00:00.000Z";

          const to = new Date().toISOString();

          const date = faker[type].between(from, to);

          const ds = date[s.format === "iso" ? "toISOString" : "toUTCString"]();

          return [property, ds];
        }

        if (Builder.match<Truck.TInternet>(matchers.net, type)) {
          return [property, faker.internet[type]()];
        }

        if (Builder.match<Truck.TLorem>(matchers.lorem, type)) {
          const s = schema[property] as Truck.TLorem;

          const input = misc.cased(faker.lorem[type](), s.case);

          return [property, input];
        }

        if (Builder.match<Truck.TUuid>(matchers.uuid, type)) {
          return [property, faker.datatype[type]()];
        }

        return [property, cons.UNKNOWN];
      }) as Truck.IMapping[];

      return misc.from(entries);
    } catch (error) {
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
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
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
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
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
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
      if (isError(error)) {
        const logger = new Logger();

        logger.fail(212, { error: error.message });
        process.exit(0);
      }
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
        case "firstName":
        case "lastName":
        case "fullName":
        case "date":
        case "url":
        case "email":
        case "paragraph":
        case "paragraphs":
        case "sentence":
        case "uuid":
        case "word":
        case "password":
        case "ip":
          return { property, notation: TypeNotation.STRING };

        case "boolean":
          return { property, notation: TypeNotation.BOOL };

        case "number":
        case "float":
          return { property, notation: TypeNotation.NUMBER };

        case "bigInt":
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

export default Builder;

export type { TBuilder };
