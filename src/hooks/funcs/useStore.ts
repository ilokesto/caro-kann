import { Context, useContext, useSyncExternalStore } from "react";
import { Board, UseStore } from "../types/Types";

export const useStore: UseStore = <T, S>(initialState: T, Board: Context<Board<T>>, selector?: (state: T) => S) => {
  const { getBoard, setBoard, subscribe } = useContext(Board);

  const snapshot = () => selector ? selector(getBoard()) : getBoard();
  const serverSideSnapshot = () => selector ? selector(initialState) : initialState;

  const board = useSyncExternalStore(subscribe, snapshot, serverSideSnapshot);

  if (selector) {
    const target = selector?.toString().split(".").at(1) as keyof ReturnType<typeof getBoard> ?? selector?.toString().split("\[\"").at(1)?.split("\"\]").at(0) as keyof ReturnType<typeof getBoard>

    const setTargetBoard = (value: ReturnType<typeof getBoard>[typeof target] | ((prev: ReturnType<typeof getBoard>[typeof target]) => ReturnType<typeof getBoard>[typeof target])) => {
      if (typeof value === "function") {
        setBoard((prev) => {
          return {
            ...prev,
            [target]: (value as (prev: ReturnType<typeof getBoard>[typeof target]) => ReturnType<typeof getBoard>[typeof target])(prev[target]),
          };
        });
      } else {
        setBoard((prev) => {
          return {
            ...prev,
            [target]: value,
          };
        });
      }
    };

    return [board, setTargetBoard] as const;
  } else {
    return [board, setBoard] as const;
  }
}