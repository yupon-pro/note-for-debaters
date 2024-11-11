export function isObj(value: unknown): value is object{
  return value != null && typeof value === "object";
};