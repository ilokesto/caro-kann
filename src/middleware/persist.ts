import { createPersistBoard } from "../core/createPersistBoard";
import { Store, Options } from "../types";

export function persist<T>(initialState: T, options: Options<T>): Store<T> {
  return createPersistBoard(initialState, options);
}