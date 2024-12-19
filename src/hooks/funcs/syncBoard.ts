import { useContext, Context, useSyncExternalStore } from "react";
import type { Board, SetStore } from "../types";


export function useStore<T>(Board: Context<Board<T>>, initialState: T): readonly [T, SetStore<T>];
export function useStore<T, S>(Board: Context<Board<T>>, initialState: T, selector: (value: T) => S): readonly [S, SetStore<T>];
export function useStore<T, S>(Board: Context<Board<T>>, initialState: T, selector?: (value: T) => S): any {
  const { getBoard, setBoard, subscribe } = useContext(Board);
  const snapshot = () => selector ? selector(getBoard()) : getBoard();
  const serverSnapshot = () => selector ? selector(initialState) : initialState;
  const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  return [board, setBoard] as const
}