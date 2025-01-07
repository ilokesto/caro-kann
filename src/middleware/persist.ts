import { createPersistBoard } from "../core/createPersistStore";
import { Store, Options } from "../types";

export function persist<T>(initialState: T, options: Options<T>): [Store<T>, "persist"] {
  return [createPersistBoard(initialState, options), "persist" as const]
}