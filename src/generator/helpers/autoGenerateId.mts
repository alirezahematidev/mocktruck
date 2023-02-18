import * as cons from "../../constants/index.mjs";
import { Truck } from "../../interfaces/index.mjs";
import { IReturnEntries } from "../types.mjs";
import * as misc from "../../misc/index.mjs";
import * as types from "../types.mjs";

export class AutoGenerateId {
  public static generate(
    list: IReturnEntries[],
    autoGenerateId: Truck.AutoGenerateIdOptions,
    increment?: () => number,
  ) {
    const field = autoGenerateId.field ?? cons.FIELD;

    const strategy = autoGenerateId.strategy ?? cons.STRATEGY;

    const isFieldDuplicated = misc.isDuplicatedField(list, field);

    if (!isFieldDuplicated) {
      const mappedList = list.map((obj, index) => {
        return {
          [field]: misc.generateId(strategy, index, increment),
          ...obj,
        };
      }) as types.IReturnEntries[];

      return mappedList;
    }
  }
}
