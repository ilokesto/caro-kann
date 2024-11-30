import { Context, useContext, useSyncExternalStore } from "react";
import { Board, UseStore } from "../types/Types";

export const useStore: UseStore = <T, S>(Board: Context<Board<T>>, selector?: (state: T) => S) => {
  const { getBoard, setBoard, subscribe } = useContext(Board);

  const snapshot = () => selector ? selector(getBoard()) : getBoard();

  const board = useSyncExternalStore(subscribe, snapshot, snapshot);

  return [board, setBoard] as const;
}