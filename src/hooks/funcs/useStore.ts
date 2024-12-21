import { useContext, Context, useSyncExternalStore } from "react";
import type { Board, UseStore } from "../types";

export const useStore: UseStore = <T, S>(Board: Context<Board<T>>, selector?: (value: T) => S): any => {
  const { getBoard, setBoard, subscribe, getInitState } = useContext(Board);
  const snapshot = (fn: () => T) => () => selector ? selector(fn()) : fn();
  const board = useSyncExternalStore(subscribe, snapshot(getBoard), snapshot(getInitState));
  return [board, setBoard] as const
}