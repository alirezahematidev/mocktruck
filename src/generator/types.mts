import { TypeNotation } from "../constants/notations.enum.mjs";
import { Truck } from "../typings/index.mjs";

export type IPrimitive = string | number | bigint | boolean;

export type IObject = Record<string, IPrimitive>;

export type IArray = IObject[];

export type IComplex = IPrimitive | IObject | IArray;

export type IReturnArray = [string, IArray];

export type IReturnPrimitive = [string, IPrimitive];

export type IReturnObject = [string, IObject];

export type IMapping = [string, IComplex];

export type IReturnEntries = Record<string, IComplex>;

export type IMock = IReturnEntries | IReturnEntries[];

export type TypeReference = {
  [ref: string]: string;
};

export type ITypeRecord = {
  infer: string;
  reference: Map<string, string>;
};

export type IType = Record<string, ITypeRecord>;

export type IOptions = Record<string, Truck.Options>;

export type TypedProperty = {
  property: string;
  notation: TypeNotation;
};
