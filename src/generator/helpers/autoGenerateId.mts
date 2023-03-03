import * as cons from "../../constants/index.mjs";
import * as misc from "../../misc/index.mjs";
import Truck from "../../interfaces/index.mjs";

export class AutoGenerateId {
  public static generate(
    list: Truck.IReturnEntries[],
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
      }) as Truck.IReturnEntries[];

      return mappedList;
    }
  }
}
