import { Truck } from "../interfaces/index.mjs";
import * as c from "../constants/index.mjs";
import * as misc from "../misc/index.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import type { TBuilder } from "./index.mjs";

export class TypeMaker {
  private schema: Truck.Schema;
  private property: string;

  constructor(schema: Truck.Schema) {
    this.schema = schema;
    this.property = c.EMPTY;
  }

  public make(property: string) {
    this.property = property;
    return this;
  }

  public satisfy(notation: TypeNotation) {
    const options = this.schema[this.property];

    const type = misc.wrapType(notation, options);

    return this.property + type;
  }

  public struct(builder: TBuilder, structure: Truck.TStruct) {
    const typing = builder.typing(structure.schema);

    const type = misc.structType(typing, structure);

    return this.property + type;
  }
  public list(builder: TBuilder, structure: Truck.TArray) {
    const typing = builder.typing(structure.schema);

    const type = misc.listType(typing, structure);

    return this.property + type;
  }
}
