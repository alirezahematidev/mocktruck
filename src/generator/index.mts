import { Truck } from "../interfaces/index.mjs";
import * as misc from "../misc/index.mjs";
import * as g from "../externals/pkg/index.js";
import * as c from "../constants/index.mjs";
import * as T from "./types.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import { TypeMaker } from "./utilities.class.mjs";

/** @todo Implemented specific types for struct properties */
/** @todo Implemented specific types for list properties */
/** @todo Clean code mocked logic functionalities */

class Builder {
  private static map = new Map<string, T.IMock>();
  private static type: T.IType = c.BRACES;
  private static count: number = c.ZERO;
  private static isArray: boolean = false;

  public static get entries() {
    const data = misc.fromMap(Builder.map.entries());

    const isArray = Builder.isArray;

    return { data, isArray };
  }

  public static types(model: string) {
    return (Builder.type[model] || c.EMPTY).trim();
  }

  private static extendType(model: string, type: string) {
    if (typeof Builder.type[model] === "undefined") {
      Builder.type[model] = c.EMPTY;
    }

    Builder.type[model] += type;
  }

  private static build(schema: Truck.Schema): T.IReturnEntries {
    try {
      const properties = misc.getKeys(schema);

      const entries = properties.map((property) => {
        const type = schema[property].type;

        switch (type) {
          case "array":
            const arraySchema = schema[property] as Truck.TArray;

            const arrayLength = arraySchema.count ?? c.LENGTH;

            const autoGenerateId = arraySchema.autoGenerateId;

            const list = misc.list(arrayLength, () =>
              Builder.build(arraySchema.schema),
            );

            if (!misc.isOptionEnabled(autoGenerateId)) {
              return [property, list] as T.IReturnArray;
            }

            const mappedList = Builder.autoGenerateIdMapper(
              list,
              autoGenerateId,
              Builder.counter(),
            );

            return [property, mappedList || list] as T.IReturnArray;

          case "object":
            const objectSchema = schema[property] as Truck.TStruct;

            return [
              property,
              Builder.build(objectSchema.schema),
            ] as T.IReturnObject;

          case "firstname":
            const fcharSchema = schema[property] as Truck.TChar;

            const firstname = g.generate_firstname();

            const casedFirstname = misc.cased(firstname, fcharSchema.case);

            return [property, casedFirstname] as T.IReturnPrimitive;

          case "lastname":
            const lcharSchema = schema[property] as Truck.TChar;

            const lastname = g.generate_lastname();

            const casedLastname = misc.cased(lastname, lcharSchema.case);

            return [property, casedLastname] as T.IReturnPrimitive;

          case "fullname":
            const ffcharSchema = schema[property] as Truck.TChar;

            const fullname = g.generate_fullname();

            const casedFullname = misc.cased(fullname, ffcharSchema.case);

            return [property, casedFullname] as T.IReturnPrimitive;

          case "digits":
            const numberSchema = schema[property] as Truck.TDigit;

            const digitLength = numberSchema.length ?? c.DIGIT;

            const digit = g.generate_number(digitLength);

            return [property, misc.parseDigits(digit)] as T.IReturnPrimitive;

          case "bigint":
            const bigintSchema = schema[property] as Truck.TDigit;

            const bigintLength = bigintSchema.length ?? c.DIGIT;

            const bigint = g.generate_number(bigintLength);

            return [property, bigint] as T.IReturnPrimitive;

          case "date":
            const dateSchema = schema[property] as Truck.TDate;

            const format = dateSchema.format;

            let randomDate = "";

            if (format === "UTC") {
              randomDate = g.generate_utc_date();
            } else {
              randomDate = g.generate_iso_date();
            }

            return [property, randomDate] as T.IReturnPrimitive;

          case "domain":
            const domain = g.generate_domain();

            return [property, domain] as T.IReturnPrimitive;

          case "email":
            const email = g.generate_email();

            return [property, email] as T.IReturnPrimitive;

          case "paragraph":
            const pcharSchema = schema[property] as Truck.TChar;

            const paragraph = g.generate_paragraph();

            const casedParagraph = misc.cased(paragraph, pcharSchema.case);

            return [property, casedParagraph] as T.IReturnPrimitive;

          case "paragraphs":
            const ppcharSchema = schema[property] as Truck.TChar;

            const paragraphs = g.generate_paragraphs();

            const casedParagraphs = misc.cased(paragraphs, ppcharSchema.case);

            return [property, casedParagraphs] as T.IReturnPrimitive;

          case "sentence":
            const scharSchema = schema[property] as Truck.TChar;

            const sentence = g.generate_sentence();

            const casedSentence = misc.cased(sentence, scharSchema.case);

            return [property, casedSentence] as T.IReturnPrimitive;

          case "word":
            const wcharSchema = schema[property] as Truck.TChar;

            const word = g.generate_word();

            const casedWord = misc.cased(word, wcharSchema.case);

            return [property, casedWord] as T.IReturnPrimitive;

          case "uuid":
            const uuid = g.generate_uuid();

            return [property, uuid] as T.IReturnPrimitive;

          case "boolean":
            const boolSchema = schema[property] as Truck.TBool;

            const f = boolSchema.frequency;

            const freq = misc.valuable(f) ? f : c.FREQ;

            const bool = g.generate_bool(freq);

            return [property, bool] as T.IReturnPrimitive;

          default:
            return [property, c.UNKNOWN] as T.IReturnPrimitive;
        }
      }) as T.IMapping[];

      return misc.from(entries);
    } catch (error) {
      throw error;
    }
  }

  static typing(schema: Truck.Schema) {
    try {
      const typeMaker = new TypeMaker(schema);

      const typed = Builder.typedProperties(schema);

      const notations: string[] = typed.map(({ property, notation }) => {
        switch (notation) {
          case TypeNotation.STRING:
            return typeMaker.make(property).satisfy(notation);

          case TypeNotation.NUMBER:
            return typeMaker.make(property).satisfy(notation);

          case TypeNotation.BIGINT:
            return typeMaker.make(property).satisfy(notation);

          case TypeNotation.BOOL:
            return typeMaker.make(property).satisfy(notation);

          case TypeNotation.OBJECT:
            return typeMaker
              .make(property)
              .struct(Builder, schema[property] as Truck.TStruct);

          case TypeNotation.ARRAY:
            return typeMaker
              .make(property)
              .list(Builder, schema[property] as Truck.TArray);

          default:
            return typeMaker.make(property).satisfy(TypeNotation.UNKNOWN);
        }
      });

      return notations.filter(Boolean).join("");
    } catch (error) {
      throw error;
    }
  }

  static iterate(models: Truck.ConfigModel[]) {
    try {
      Builder.isArray = false;

      models.forEach((model) => {
        const name = model.name;

        const options = model.options ?? {};

        const schema = model.schema;

        const listOptions = options.listOptions;

        if (misc.isOptionEnabled(listOptions)) {
          Builder.isArray = true;

          const length = listOptions.count ?? c.LENGTH;

          const autoGenerateId = listOptions.autoGenerateId;

          const list = misc.list(length, () => Builder.build(schema));

          if (!misc.isOptionEnabled(autoGenerateId)) {
            Builder.extendType(name, Builder.typing(schema));

            return Builder.map.set(name, list);
          }

          const mappedList = Builder.autoGenerateIdMapper(list, autoGenerateId);

          const modifiedTyping = misc.optionsListType(
            Builder.typing(schema),
            listOptions,
          );

          Builder.extendType(name, modifiedTyping);

          return Builder.map.set(name, mappedList || list);
        }

        Builder.extendType(name, Builder.typing(schema));

        Builder.map.set(name, Builder.build(schema));
      });
    } catch (error) {
      throw error;
    }
  }

  static configure(configs: Truck.Configuration) {
    try {
      const models = configs.models;

      Builder.iterate(misc.parseIterable(models));
    } catch (error) {
      throw error;
    }
  }

  private static autoGenerateIdMapper(
    list: T.IReturnEntries[],
    autoGenerateId: Truck.AutoGenerateIdOptions,
    increment?: () => number,
  ) {
    const field = autoGenerateId.field ?? c.FIELD;

    const strategy = autoGenerateId.strategy ?? c.STRATEGY;

    const isFieldDuplicated = misc.isDuplicatedField(list, field);

    if (!isFieldDuplicated) {
      const mappedList = list.map((obj, index) => {
        return {
          [field]: misc.generateId(strategy, index, increment),
          ...obj,
        };
      }) as T.IReturnEntries[];

      return mappedList;
    }
  }

  private static typedProperties(schema: Truck.Schema): T.TypedProperty[] {
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

  private static counter() {
    return function increment() {
      Builder.count++;

      return Builder.count;
    };
  }
}

type TBuilder = typeof Builder;

export { Builder };

export type { TBuilder };
