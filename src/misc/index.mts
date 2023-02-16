import {
  FIELD,
  STRATEGY,
  BR,
  BRACKET,
  END,
  EQ,
  EX,
  IM,
} from "../constants/index.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import * as generators from "../externals/pkg/index.js";
import { Truck } from "../interfaces/index.mjs";

export function awaited<P extends any, R extends any>(fn: (...args: P[]) => R) {
  return async (...args: P[]) => {
    const awaitedFn = await new Promise<R>((resolve) => resolve(fn(...args)));

    return awaitedFn;
  };
}

export function getKeys<T extends object>(obj: T): Array<string> {
  return Object.keys(obj ?? {});
}

export function isOptionEnabled<T extends object>(
  obj: T | undefined,
): obj is T {
  return Boolean(obj && getKeys(obj).length !== 0);
}

export function list<R extends any>(
  length: number,
  fn: (i: number) => R,
): Array<R> {
  const array = Array.from({ length }, (_noop, i) => fn(i));

  return array;
}

export function isDuplicatedField<A extends Array<object>>(
  list: A,
  field: string,
): boolean {
  return !!list.find((obj) => Object.hasOwn(obj, field));
}

export function generateId(
  strategy: "uuid" | "autoincrement",
  index: number,
  increment?: () => number,
) {
  if (strategy === "autoincrement") {
    if (increment) {
      return increment();
    }

    return index + 1;
  }

  return generators.generate_uuid();
}

export function cap(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function cased(
  input: string,
  form?: "uppercase" | "lowercase" | "capitalize",
): string {
  if (!form) return input;

  switch (form) {
    case "lowercase":
      input = input.toLowerCase();
      break;
    case "uppercase":
      input = input.toUpperCase();
      break;
    case "capitalize":
      const chunks = input.split(" ");

      if (chunks.length === 1) {
        input = cap(input);
      } else {
        const rejoin = chunks.map((chunk) => cap(chunk)).join(" ");

        input = rejoin;
      }
      break;
  }

  return input;
}

export function parseDigits(digit: bigint): number {
  return Number.parseInt(digit.toString());
}

export function from<T extends any, R extends Record<keyof T, T>>(
  entries: T[][],
): R {
  return Object.fromEntries(entries);
}

export function fromMap<K extends string, V extends any>(
  entries: IterableIterator<[K, V]>,
): { [k: string]: V } {
  return Object.fromEntries<V>(entries);
}

export function valuable<T>(input: T | undefined | null): input is T {
  return input !== undefined && input !== null;
}

export function isArray<T extends any>(list: T | T[]): list is T[] {
  return Array.isArray(list);
}

export function parseIterable<T extends any>(list: T | T[]): T[] {
  if (isArray(list)) {
    return list;
  }

  return [list];
}

export function orWith(input: string, note: string): string {
  return input + " | " + note;
}

export function andWith(input: string, note: string): string {
  return input + " & " + note;
}

export function bricks(input: string) {
  return "{\n" + input + "\n}";
}

export function braces(input: string) {
  return "{" + input + "}";
}

export function sumString(...args: string[]): string {
  return args.reduce((a, b) => a + " " + b, "");
}

export function typedDef(name: string, type: string, isArray: boolean) {
  const modifiedType = isArray ? type + BRACKET : type;

  return sumString(name, ":", modifiedType);
}

export function wrapType<S extends Truck.SharedTypeOptions>(
  notation: TypeNotation,
  options: S,
) {
  const ONotation = options.optional ? "?:" : ":";

  const NNotation = options.nullable
    ? orWith(notation, TypeNotation.NULL)
    : notation;

  const wrapper = sumString(ONotation, NNotation, END);

  return wrapper;
}

export function structType(typing: string, options: Truck.TStruct) {
  const ONotation = options.optional ? "?:" : ":";

  const NNotation = options.nullable
    ? orWith(bricks(typing), TypeNotation.NULL)
    : bricks(typing);

  const wrapper = sumString(ONotation, NNotation, END);

  return wrapper;
}

export function listType(typing: string, options: Truck.TArray) {
  const ONotation = options.optional ? "?:" : ":";

  const autoGenerateId = options.autoGenerateId;

  let modifiedTyping = typing;

  if (isOptionEnabled(autoGenerateId)) {
    const field = autoGenerateId.field ?? FIELD;

    const strategy = autoGenerateId.strategy ?? STRATEGY;

    let notation = TypeNotation.STRING;

    if (strategy === "autoincrement") {
      notation = TypeNotation.NUMBER;
    }

    const fieldTyping = sumString(field, ":", notation, END);

    modifiedTyping = sumString(fieldTyping, modifiedTyping);
  }

  const NNotation = options.nullable
    ? orWith(bricks(modifiedTyping), TypeNotation.NULL)
    : bricks(modifiedTyping);

  const wrapper = sumString(ONotation, NNotation, BRACKET, END);

  return wrapper;
}

export function optionsListType(typing: string, options: Truck.ListOptions) {
  const autoGenerateId = options.autoGenerateId;

  let modifiedTyping = typing;

  if (isOptionEnabled(autoGenerateId)) {
    const field = autoGenerateId.field ?? FIELD;

    const strategy = autoGenerateId.strategy ?? STRATEGY;

    let notation = TypeNotation.STRING;

    if (strategy === "autoincrement") {
      notation = TypeNotation.NUMBER;
    }

    const fieldTyping = sumString(field, ":", notation, END);

    modifiedTyping = sumString(fieldTyping, modifiedTyping);
  }

  return modifiedTyping;
}

export function typedRaw(name: string, type: string) {
  const def = sumString("type", name, EQ, bricks(type), END);
  const exp = sumString(EX, "type", braces(name));

  return sumString(def, BR, exp);
}

export function mockedRaw(
  input: string,
  name: string,
  typeName: string,
  isArray: boolean,
) {
  const imp = sumString(IM, braces(typeName), "from", `"./type"`, END);
  const def = sumString(
    "const",
    typedDef(name, typeName, isArray),
    EQ,
    input,
    END,
  );
  const exp = sumString(EX, braces(name));

  return sumString(imp, BR, def, BR, exp);
}
