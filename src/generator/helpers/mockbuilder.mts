import * as misc from "../../misc/index.mjs";
import * as cons from "../../constants/index.mjs";
import Truck from "../../interfaces/index.js";
import { TBuilder } from "../index.mjs";
import { AutoGenerateId } from "./autoGenerateId.mjs";

class MockBuilder extends AutoGenerateId {
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

  public array(property: string, builder: TBuilder): Truck.IReturnArray {
    const arraySchema = this.schema[property] as Truck.TArray;

    const arrayLength = arraySchema.count ?? cons.LENGTH;

    const autoGenerateId = arraySchema.autoGenerateId;

    const list = misc.list(arrayLength, () =>
      builder.build(arraySchema.schema),
    );

    if (!misc.isOptionEnabled(autoGenerateId)) {
      return [property, list] as Truck.IReturnArray;
    }

    const mappedList = MockBuilder.generate(
      list,
      autoGenerateId,
      this.counter(),
    );

    return [property, mappedList || list] as Truck.IReturnArray;
  }

  public object(property: string, builder: TBuilder): Truck.IReturnObject {
    const objectSchema = this.schema[property] as Truck.TStruct;

    return [
      property,
      builder.build(objectSchema.schema),
    ] as Truck.IReturnObject;
  }
}

export { MockBuilder };
