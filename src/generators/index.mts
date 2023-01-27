import { randomInt, randomUUID } from "node:crypto";

function generateNumber(count: number = 8): number {
  const _count = count <= 0 ? 8 : count;

  const min = Math.pow(10, _count - 1);
  const max = Math.pow(10, _count) - 1;

  const value = randomInt(min, max);

  return value;
}

function generateChar(
  count: number = 8,
  type?: "lowercase" | "uppercase",
): string {
  const _count = count <= 0 ? 8 : count;

  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let result = "";

  if (type === "lowercase") {
    for (let i = 0; i < _count; ++i) {
      result += lowerChars[Math.floor(lowerChars.length * Math.random())];
    }
    return result;
  }

  if (type === "uppercase") {
    for (let i = 0; i < _count; ++i) {
      result += upperChars[Math.floor(upperChars.length * Math.random())];
    }
    return result;
  }

  for (let i = 0; i < _count; ++i) {
    result += chars[Math.floor(chars.length * Math.random())];
  }

  return result;
}

function generateBool(frequency: number = 0.5): true | false {
  if (frequency <= 0) return false;

  if (frequency >= 1) return true;

  return Math.random() >= frequency;
}

function generateUUID(): string {
  return randomUUID();
}

export { generateBool, generateChar, generateNumber, generateUUID };
