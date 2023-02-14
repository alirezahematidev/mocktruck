type IPrimitive = string | number | boolean;

type IObject = Record<string, IPrimitive>;

type IArray = IObject[];

type IComplex = IPrimitive | IObject | IArray;

type IReturnArray = [string, IArray];

type IReturnPrimitive = [string, IPrimitive];

type IReturnObject = [string, IObject];

type IMapping = [string, IComplex];

type IReturnEntries = Record<string, IComplex>;

type IMock = IReturnEntries | IReturnEntries[];

export type {
  IReturnArray,
  IReturnEntries,
  IReturnObject,
  IReturnPrimitive,
  IMapping,
  IPrimitive,
  IObject,
  IArray,
  IComplex,
  IMock,
};
