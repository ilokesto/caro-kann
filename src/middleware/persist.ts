import { createPersistBoard } from "../core/createPersistBoard";
import { Board, Options } from "../types";

export function persist<T>(initialState: T, options: Options<T>): Board<T> {
  return createPersistBoard(initialState, options);
}