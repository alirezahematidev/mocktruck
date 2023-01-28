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
  let chars = "";
  let result = "";

  if (type === "lowercase") {
    chars = "abcdefghijklmnopqrstuvwxyz";
  } else if (type === "uppercase") {
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  } else {
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  }

  for (let i = 0; i < _count; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
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

function generateEmail(): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  const providers = ["gmail", "yahoo"];

  let email = "";

  for (let i = 0; i < 10; i++) {
    email += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  email += "@";
  email += providers[Math.floor(Math.random() * providers.length)];
  email += ".com";

  return email;
}

function generateURL(): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let url = "";

  let sfx = [".com", ".org", ".edu", ".gov", ".co", ".io"];

  let randomSuffix = sfx[Math.floor(Math.random() * sfx.length)];

  url += "http" + (Math.floor(Math.random() * 2) == 0 ? "" : "s") + "://";

  for (let i = 0; i < 12; i++) {
    url += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  url += randomSuffix;

  return url;
}

function generateISODate(): string {
  let start = new Date(1800, 0, 1);
  let end = new Date();

  let randomTimestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  let randomDate = new Date(randomTimestamp);

  return randomDate.toISOString();
}
function generateUTCDate(): string {
  let start = new Date(1800, 0, 1);
  let end = new Date();
  let randomTimestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  let randomDate = new Date(randomTimestamp);
  return randomDate.toUTCString();
}

function generateImage(w: string, h?: string): string {
  return `https://loremflickr.com/${w}/${h ? h : w}`;
}

export {
  generateBool,
  generateChar,
  generateNumber,
  generateUUID,
  generateEmail,
  generateURL,
  generateISODate,
  generateUTCDate,
  generateImage,
};
