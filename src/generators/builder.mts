import { Truck } from "../interfaces/index.mjs";
import * as misc from "../misc/index.mjs";
import * as g from "../externals/pkg/index.js";
import * as c from "../constants/index.mjs";
import * as T from "./types.mjs";

class Builder {
  public static __build: string | undefined;
  private static map = new Map<string, T.IMock>();

  constructor() {
    Builder.__build = undefined;
    Builder.map = new Map();
  }

  public static mock() {
    return misc.fromMap(Builder.map.entries());
  }

  static build(schema: Truck.Schema): T.IReturnEntries {
    const properties = misc.getKeys(schema);

    this.__build = g.generate_uuid();

    const entries = properties.map((property) => {
      const type = schema[property].type;

      switch (type) {
        case "array":
          const arraySchema = schema[property] as Truck.ArraySchema;

          const arrayLength = arraySchema.count ?? c.DEFAULT_LENGTH;

          const autoGenerateId = arraySchema.autoGenerateId;

          const list = misc.list(arrayLength, () =>
            this.build(arraySchema.schema),
          );

          if (!misc.isOptionEnabled(autoGenerateId)) {
            return [property, list] as T.IReturnArray;
          }

          const mappedList = this.autoGenerateIdMapper(list, autoGenerateId);

          return [property, mappedList || list] as T.IReturnArray;

        case "object":
          const objectSchema = schema[property] as Truck.ObjectSchema;

          return [property, this.build(objectSchema.schema)] as T.IReturnObject;

        case "firstname":
          const fcharSchema = schema[property] as Truck.CharSchema;

          const firstname = g.generate_firstname();

          const casedFirstname = misc.cased(firstname, fcharSchema.case);

          return [property, casedFirstname] as T.IReturnPrimitive;

        case "lastname":
          const lcharSchema = schema[property] as Truck.CharSchema;

          const lastname = g.generate_lastname();

          const casedLastname = misc.cased(lastname, lcharSchema.case);

          return [property, casedLastname] as T.IReturnPrimitive;

        case "fullname":
          const ffcharSchema = schema[property] as Truck.CharSchema;

          const fullname = g.generate_fullname();

          const casedFullname = misc.cased(fullname, ffcharSchema.case);

          return [property, casedFullname] as T.IReturnPrimitive;

        case "digits":
          const numberSchema = schema[property] as Truck.NumberSchema;

          const digitLength = numberSchema.length ?? c.DEFAULT_DIGIT;

          const digit = g.generate_number(digitLength);

          return [property, misc.parseDigits(digit)] as T.IReturnPrimitive;

        case "date":
          const dateSchema = schema[property] as Truck.DateSchema;

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
          const pcharSchema = schema[property] as Truck.CharSchema;

          const paragraph = g.generate_paragraph();

          const casedParagraph = misc.cased(paragraph, pcharSchema.case);

          return [property, casedParagraph] as T.IReturnPrimitive;

        case "paragraphs":
          const ppcharSchema = schema[property] as Truck.CharSchema;

          const paragraphs = g.generate_paragraphs();

          const casedParagraphs = misc.cased(paragraphs, ppcharSchema.case);

          return [property, casedParagraphs] as T.IReturnPrimitive;

        case "sentence":
          const scharSchema = schema[property] as Truck.CharSchema;

          const sentence = g.generate_sentence();

          const casedSentence = misc.cased(sentence, scharSchema.case);

          return [property, casedSentence] as T.IReturnPrimitive;

        case "word":
          const wcharSchema = schema[property] as Truck.CharSchema;

          const word = g.generate_word();

          const casedWord = misc.cased(word, wcharSchema.case);

          return [property, casedWord] as T.IReturnPrimitive;

        case "uuid":
          const uuid = g.generate_uuid();

          return [property, uuid] as T.IReturnPrimitive;

        case "boolean":
          const boolSchema = schema[property] as Truck.BoolSchema;

          const f = boolSchema.frequency;

          const freq = misc.valuable(f) ? f : c.DEFAULT_FREQ;

          const bool = g.generate_bool(freq);

          return [property, bool] as T.IReturnPrimitive;

        default:
          return [property, c.UNKNOWN] as T.IReturnPrimitive;
      }
    }) as T.IMapping[];

    return misc.from(entries);
  }

  static iterate(models: Truck.ConfigModel[]) {
    models.forEach((model) => {
      const name = model.name;

      const options = model.options ?? {};

      const schema = model.schema;

      const listOptions = options.listOptions;

      if (misc.isOptionEnabled(listOptions)) {
        const length = listOptions.count ?? c.DEFAULT_LENGTH;

        const autoGenerateId = listOptions.autoGenerateId;

        const list = misc.list(length, () => Builder.build(schema));

        if (!misc.isOptionEnabled(autoGenerateId)) {
          return this.map.set(name, list);
        }

        const mappedList = this.autoGenerateIdMapper(list, autoGenerateId);

        return this.map.set(name, mappedList || list);
      }

      // typeSet += typeMapping(schema);

      // typesMap.set(name, typeMapping(schema));

      this.map.set(name, Builder.build(schema));
    });
  }

  private static autoGenerateIdMapper(
    list: T.IReturnEntries[],
    autoGenerateId: Truck.AutoGenerateIdOptions,
  ) {
    const field = autoGenerateId.field ?? c.DEFAULT_FIELD;

    const strategy = autoGenerateId.strategy ?? c.DEFAULT_STRATEGY;

    const isFieldDuplicated = misc.isDuplicatedField(list, field);

    if (!isFieldDuplicated) {
      const mappedList = list.map((obj, index) => ({
        [field]: misc.generateId(strategy, index),
        ...obj,
      })) as T.IReturnEntries[];

      return mappedList;
    }
  }
}

export { Builder };
