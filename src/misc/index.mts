import * as generators from "../externals/pkg/index.js";

function getKeys<T extends object>(obj: T): string[] {
  return Object.keys(obj ?? {});
}

function isOptionEnabled<T extends object>(obj: T | undefined): obj is T {
  return Boolean(obj && getKeys(obj).length !== 0);
}

function list<R extends any>(length: number, fn: (i: number) => R): Array<R> {
  const array = Array.from({ length }, (_noop, i) => fn(i));

  return array;
}

function isDuplicatedField<A extends Array<object>>(
  list: A,
  field: string,
): boolean {
  return !!list.find((obj) => Object.hasOwn(obj, field));
}

function generateId(strategy: "uuid" | "autoincrement", i: number) {
  if (strategy === "autoincrement") {
    return i + 1;
  }

  return generators.generate_uuid();
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function cased(
  value: string,
  form?: "uppercase" | "lowercase" | "capitalize",
): string {
  if (!form) return value;

  switch (form) {
    case "lowercase":
      value = value.toLowerCase();
      break;
    case "uppercase":
      value = value.toUpperCase();
      break;
    case "capitalize":
      const chunks = value.split(" ");

      if (chunks.length === 1) {
        value = cap(value);
      } else {
        const rejoin = chunks.map((chunk) => cap(chunk)).join(" ");

        value = rejoin;
      }
      break;
  }

  return value;
}

function parseDigits(digit: bigint): number {
  return Number.parseInt(digit.toString());
}

function from<T extends any, R extends Record<string, T>>(entries: T[][]): R {
  return Object.fromEntries(entries);
}

function fromMap<K extends string, V extends any>(
  entries: IterableIterator<[K, V]>,
): { [k: string]: V } {
  return Object.fromEntries<V>(entries);
}

function valuable<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

function isArray<T extends any>(list: T | T[]): list is T[] {
  return Array.isArray(list);
}

function parseIterable<T extends any>(list: T | T[]): T[] {
  if (isArray(list)) {
    return list;
  }

  return [list];
}

export {
  getKeys,
  isOptionEnabled,
  list,
  isDuplicatedField,
  generateId,
  cased,
  parseDigits,
  from,
  valuable,
  fromMap,
  isArray,
  parseIterable,
};
