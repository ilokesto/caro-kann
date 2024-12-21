import { SetBoard } from "../types";
import { parseObjectPath } from "./parseObjectPath";
import { updateNestedValue } from "./updateNestedValue";

export const createSetTargetBoard = <T, S>(setBoard: SetBoard<T>, selector: (value: T) => S) => (value: S | ((prev: S) => S)) => { setBoard((prev) => {
  const path = parseObjectPath(selector.toString());
  const newBoard = {...prev};

  typeof value === "function"
    ? updateNestedValue(newBoard, path, (value as (prev: S) => S)(selector(prev)))
    : updateNestedValue(newBoard, path, value)

  return newBoard;
})}