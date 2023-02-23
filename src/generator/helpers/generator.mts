import { Truck } from "../../interfaces/index.mjs";
import {
  IReturnArray,
  IReturnEntries,
  IReturnObject,
  IReturnPrimitive,
} from "../types.mjs";
import * as misc from "../../misc/index.mjs";
import * as cons from "../../constants/index.mjs";
import * as gen from "../../externals/pkg/index.js";
import { TBuilder } from "../index.mjs";
import { AutoGenerateId } from "./autoGenerateId.mjs";

type CharCallback = () => string;

export class Generator extends AutoGenerateId {
  private schema: Truck.Schema;
  private count: number;

  constructor(schema: Truck.Schema) {
    super();

    this.schema = schema;
    this.count = cons.ZERO;
  }

  private counter() {
    return () => {
      this.count++;

      return this.count;
    };
  }

  public array(property: string, builder: TBuilder): IReturnArray {
    const arraySchema = this.schema[property] as Truck.TArray;

    const arrayLength = arraySchema.count ?? cons.LENGTH;

    const autoGenerateId = arraySchema.autoGenerateId;

    const list = misc.list(arrayLength, () =>
      builder.build(arraySchema.schema),
    );

    if (!misc.isOptionEnabled(autoGenerateId)) {
      return [property, list] as IReturnArray;
    }

    const mappedList = Generator.generate(list, autoGenerateId, this.counter());

    return [property, mappedList || list] as IReturnArray;
  }

  public object(property: string, builder: TBuilder): IReturnObject {
    const objectSchema = this.schema[property] as Truck.TStruct;

    return [property, builder.build(objectSchema.schema)] as IReturnObject;
  }

  public char(property: string, generator: CharCallback): IReturnPrimitive {
    const charSchema = this.schema[property] as Truck.TChar;

    const generated = generator();

    const casedChar = misc.cased(generated, charSchema.case);

    return [property, casedChar];
  }

  public digit(property: string): IReturnPrimitive {
    const numberSchema = this.schema[property] as Truck.TDigit;

    const digit = gen.generate_number(numberSchema.length ?? cons.DIGIT);

    return [property, misc.parseDigits(digit)];
  }

  public bigint(property: string): IReturnPrimitive {
    const bigintSchema = this.schema[property] as Truck.TDigit;

    const bigint = gen.generate_number(bigintSchema.length ?? cons.DIGIT);

    return [property, bigint];
  }

  public date(property: string): IReturnPrimitive {
    const dateSchema = this.schema[property] as Truck.TDate;

    let randomDate = "";

    if (dateSchema.format === "UTC") {
      randomDate = gen.generate_utc_date();
    } else {
      randomDate = gen.generate_iso_date();
    }

    return [property, randomDate];
  }

  public domain(property: string): IReturnPrimitive {
    const domain = gen.generate_domain();

    return [property, domain];
  }

  public email(property: string): IReturnPrimitive {
    const email = gen.generate_email();

    return [property, email];
  }

  public uuid(property: string): IReturnPrimitive {
    const uuid = gen.generate_uuid();

    return [property, uuid];
  }

  public bool(property: string): IReturnPrimitive {
    const boolSchema = this.schema[property] as Truck.TBool;

    const fr = boolSchema.frequency;

    const freq = misc.valuable(fr) ? fr : cons.FREQUENCY;

    const bool = gen.generate_bool(freq);

    return [property, bool];
  }

  public default(property: string): IReturnPrimitive {
    return [property, cons.UNKNOWN];
  }
}
