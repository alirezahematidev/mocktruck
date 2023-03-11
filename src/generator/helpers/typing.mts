import Truck from "../../interfaces/index.js";
import * as c from "../../constants/index.mjs";
import * as misc from "../../misc/index.mjs";
import { TypeNotation } from "../../constants/notations.enum.mjs";
import type { TBuilder } from "../index.mjs";

export class Typing {
  private schema: Truck.Schema;
  private model: string;
  private distinctTypes: boolean | undefined;
  private property: string;

  constructor(schema: Truck.Schema, model: string, distinctTypes?: boolean) {
    this.schema = schema;
    this.model = model;
    this.distinctTypes = distinctTypes;
    this.property = c.EMPTY;
  }

  public make(property: string) {
    this.property = property;
    return this;
  }

  public satisfy(notation: TypeNotation) {
    const schema = this.schema;
    const property = this.property;

    const options = schema[property];

    const type = misc.wrapType(property, notation, options);

    return type;
  }

  public struct(builder: TBuilder, structure: Truck.TStruct) {
    const typing = builder.typing(
      structure.schema,
      this.model,
      this.distinctTypes,
    );

    const type = misc.structType(typing, structure, this.distinctTypes);

    if (this.distinctTypes) {
      builder.refTyping(this.model, { [this.property]: type });

      return misc.wrapStructDef(this.property, structure);
    }

    return this.property + type;
  }
  public list(builder: TBuilder, structure: Truck.TArray) {
    const typing = builder.typing(
      structure.schema,
      this.model,
      this.distinctTypes,
    );

    const type = misc.listType(typing, structure, this.distinctTypes);

    if (this.distinctTypes) {
      builder.refTyping(this.model, { [this.property]: type });

      return misc.wrapArrayDef(this.property, structure);
    }

    return this.property + type;
  }
}
