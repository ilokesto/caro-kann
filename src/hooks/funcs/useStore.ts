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
    const path = selector.toString().split(".").slice(1);
    const setTargetBoard = (value: S | ((prev: S) => S)) => {
      if (typeof value === "function") {
        setBoard((prev) => {updateNestedValue(prev, path, (value as (prev: S) => S)(selector(prev))); return prev;});
      } else {
        setBoard((prev) => {updateNestedValue(prev, path, value); return prev;});
      }
    };

    return [board, setTargetBoard, setBoard] as const;
  } else {
    return [board, setBoard] as const;
  }
}
