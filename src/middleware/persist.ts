import { createPersistBoard } from "../core/createPersistBoard";
import { Options } from "../types";

export function persist<T>(initialState: T, options: Options<T>) {
  return createPersistBoard(initialState, options);
}