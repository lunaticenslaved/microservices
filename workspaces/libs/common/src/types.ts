// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapPromiseFnResult<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : never;
