import { createPersistBoard } from "../core/createPersistStore";
import { createStore } from "../core/createStore";
import { Store, Options } from "../types";

export function persist<T>(initialState: T, options: Options<T>): [Store<T>, "persist"] {
  return [createPersistBoard(createStore(initialState), options), "persist" as const]
}