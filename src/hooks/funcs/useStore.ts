import { Context, useContext, useSyncExternalStore } from "react";
import { Board } from "../types";

const updateNestedValue = (obj: any, path: string[], value: any) => {
  if (path.length === 1) {
    obj[path[0]] = value;
  } else {
    if (!obj[path[0]]) obj[path[0]] = {};
    updateNestedValue(obj[path[0]], path.slice(1), value);
  }
};

export function useStore<T>(initialState: T, Board: Context<Board<T>>): readonly [T, Board<T>["setBoard"]];
export function useStore<T, S>(initialState: T, Board: Context<Board<T>>, selector: (state: T) => S): readonly [S, Board<T>["setBoard"]];
export function useStore<T, S>(initialState: T, Board: Context<Board<T>>, selector?: (state: T) => S) {
  const { getBoard, setBoard, subscribe } = useContext(Board);

  const snapshot = () => selector ? selector(getBoard()) : getBoard();
  const serverSnapshot = () => selector ? selector(initialState) : initialState;

  const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  if (selector) {
    if (/[?&:|\[\]]/.test(selector.toString())) throw new Error("Invalid selector function");
    const path = selector.toString().split(".").slice(1);

    const setTargetBoard = (value: S | ((prev: S) => S)) => { setBoard((prev) => {
      const newBoard = {...prev};

      selector ? updateNestedValue(newBoard, path, (value as (prev: S) => S)(selector(prev))) : updateNestedValue(newBoard, path, value)

      return newBoard;
    })}

    return [board, setTargetBoard] as const;
  } else {
    return [board, setBoard] as const;
  }
}
