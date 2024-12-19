import { SetStore } from "../types";
import { updateNestedValue } from "./updateNestedValue";

export const createSetTargetBoard = <T, S>(setBoard: SetStore<T>, path: string[], selector: (value: T) => S) => (value: S | ((prev: S) => S)) => { setBoard((prev) => {
  const newBoard = {...prev};

  typeof value === "function"
    ? updateNestedValue(newBoard, path, (value as (prev: S) => S)(selector(prev)))
    : updateNestedValue(newBoard, path, value)

  return newBoard;
})}