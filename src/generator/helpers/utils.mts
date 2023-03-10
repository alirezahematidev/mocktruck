export function intOptions(length: number = 8) {
  if (!Number.isFinite(length)) {
    throw new Error("The number length must be finite");
  }

  length = length > 0 ? length : 8;

  const min = Math.pow(10, length - 1);

  const max = Math.pow(10, length) - 1;

  return { min, max };
}
