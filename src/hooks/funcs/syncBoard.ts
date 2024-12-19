import { useContext, Context, useSyncExternalStore } from "react";
import type { Board } from "../types";

export const useStore = <T, S>(Board: Context<Board<T>>, initialState: T, selector?: (value: T) => S) => {
  const { getBoard, setBoard, subscribe } = useContext(Board);
  const snapshot = () => selector ? selector(getBoard()) : getBoard();
  const serverSnapshot = () => selector ? selector(initialState) : initialState;
  const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  return [board, setBoard] as const
}