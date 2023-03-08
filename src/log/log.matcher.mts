import { LogPattern } from "./types/log.type.mjs";

function matcher(text: string, patterns: LogPattern = {}) {
  const RE = /\{(\w+)\}/g;

  return text.replace(RE, (_, p: string) => patterns[p]?.toString() || p);
}

export { matcher };
