import {
  FIELD,
  STRATEGY,
  BR,
  BRACKET,
  END,
  EQ,
  EX,
  IM,
  EMPTY,
} from "../constants/index.mjs";
import { TypeNotation } from "../constants/notations.enum.mjs";
import * as generators from "../externals/pkg/index.js";
import { ITypeRecord } from "../generator/types.mjs";
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

export function dot(...args: string[]) {
  return args.join(".");
}

export function modify(filename: string) {
  const regex = /\W+/g;

  const name = filename.replace(regex, EMPTY);

  return name;
}

export function tname(options?: Truck.GlobalOptions | Truck.Options) {
  const basename = dot("data", "type");

  console.log(basename);

  if (!isOptionEnabled(options)) return basename;

  const typename = options.filename;

  if (!typename) return basename;

  if (typeof typename === "string") {
    return dot(modify(typename), "type") || basename;
  }

  const d = modify(typename.data) || basename;

  const t = typename.type;

  if (!t) return dot(d, "type");

  return modify(t) || dot(d, "type");
}

export function dname(options?: Truck.GlobalOptions | Truck.Options) {
  const basename = "data";

  if (!isOptionEnabled(options)) return basename;

  const filename = options.filename;

  if (!filename) return basename;

  if (typeof filename === "string") {
    return modify(filename) || basename;
  }

  const d = modify(filename.data) || basename;

  return d;
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
  return args.join(" ");
}

export function stackString(...args: string[]): string {
  return args.join("");
}

export function typedDef(name: string, type: string, isArray: boolean) {
  const modifiedType = isArray ? type + BRACKET : type;

  return sumString(name, ":", modifiedType);
}

export function wrapType<S extends Truck.SharedTypeOptions>(
  property: string,
  notation: TypeNotation,
  options: S,
) {
  const ONotation = options.optional ? "?:" : ":";

  const NNotation = options.nullable
    ? orWith(notation, TypeNotation.NULL)
    : notation;

  const wrapper = sumString(ONotation, NNotation, END);

  return property + wrapper;
}

export function wrapStructType(property: string, type: string) {
  const notation = sumString(property, EQ, type);

  const wrapper = sumString("type", notation, BR);

  return wrapper;
}

export function wrapStructDef<S extends Truck.SharedTypeOptions>(
  property: string,
  options: S,
) {
  const prop = cap(property);

  const ONotation = options.optional ? "?:" : ":";

  const NNotation = options.nullable ? orWith(prop, TypeNotation.NULL) : prop;

  const wrapper = sumString(property, ONotation, NNotation, END);

  return wrapper;
}

export function wrapArrayDef<S extends Truck.SharedTypeOptions>(
  property: string,
  options: S,
) {
  const cprop = cap(property);

  const ONotation = options.optional ? "?:" : ":";

  const NNotation = options.nullable
    ? orWith(BRACKET, TypeNotation.NULL)
    : BRACKET;

  const wrapper = sumString(property, ONotation, cprop, NNotation, END);

  return wrapper;
}

export function structType(
  typing: string,
  options: Truck.TStruct,
  distinctTypes?: boolean,
) {
  const ONotation = options.optional ? "?:" : ":";

  const NNotation =
    options.nullable && !distinctTypes
      ? orWith(bricks(typing), TypeNotation.NULL)
      : bricks(typing);

  const wrapper = sumString(distinctTypes ? EMPTY : ONotation, NNotation, END);

  return wrapper;
}

export function listType(
  typing: string,
  options: Truck.TArray,
  distinctTypes?: boolean,
) {
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

  const NNotation =
    options.nullable && !distinctTypes
      ? orWith(bricks(modifiedTyping), TypeNotation.NULL)
      : bricks(modifiedTyping);

  const wrapper = sumString(
    distinctTypes ? EMPTY : ONotation,
    NNotation,
    distinctTypes ? EMPTY : BRACKET,
    END,
  );

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

type MapObject = { key: string; value: string };

export function mapObject<T extends object>(obj: T): MapObject {
  return Object.keys(obj).reduce(
    (_p, q) => ({ key: q, value: obj[q as keyof T] } as MapObject),
    {} as MapObject,
  );
}

export function typedRaw(name: string, type: ITypeRecord) {
  let refs: string = "";

  let typenames: string[] = [name];

  for (const [key, value] of type.reference.entries()) {
    refs += sumString("type", cap(key), EQ, value, BR);
    typenames.push(cap(key));
  }

  const def = sumString("type", cap(name), EQ, bricks(type.infer), END);

  const capnames = typenames.map((name) => cap(name));

  const exp = sumString(EX, "type", braces(capnames.join(",")));

  return sumString(refs, BR, def, BR, exp);
}

type MockedRaw = {
  input: string;
  model: string;
  isArray: boolean;
  withTypes?: boolean;
  typename: string;
};

export function mockedRaw(m: MockedRaw) {
  let imp = sumString(
    IM,
    braces(cap(m.model)),
    "from",
    `"./${m.typename}"`,
    END,
  );

  if (!m.withTypes) {
    imp = EMPTY;
  }

  const typeDef = typedDef(m.model, cap(m.model), m.isArray);

  const defExp = m.withTypes ? typeDef : m.model;

  const def = sumString("const", defExp, EQ, m.input, END);

  const exp = sumString(EX, braces(m.model));

  return sumString(imp, BR, def, BR, exp);
}

export function compareString(base: string, target: string) {
  return base.toLowerCase() === target.toLowerCase();
}

export function compareAndFilter(base: string[], target: string[]) {
  return base.filter((b) => target.some((t) => compareString(b, t)));
}

export function joinString(first: string, second: string, connector?: string) {
  return sumString(first, connector ?? "_", second);
}

export function getOptions(
  globalOptions: Truck.GlobalOptions | undefined,
  options: Truck.Options | undefined,
) {
  const isOptionsEnabled = isOptionEnabled(options);
  const isGlobalOptionsEnabled = isOptionEnabled(globalOptions);

  if (!isGlobalOptionsEnabled && !isOptionsEnabled) return;

  if (options === undefined) {
    return globalOptions;
  }

  if (globalOptions === undefined) {
    return options;
  }

  return { ...globalOptions, ...options };
}
