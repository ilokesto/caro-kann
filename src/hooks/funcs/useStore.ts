import { Context, useContext, useSyncExternalStore } from "react";
import { Board, UseStore } from "../types/Types";

export const useStore: UseStore = <T, S>(initialState: T, Board: Context<Board<T>>, selector?: (state: T) => S) => {
  const { getBoard, setBoard, subscribe } = useContext(Board);

  const snapshot = () => selector ? selector(getBoard()) : getBoard();
  const serverSnapshot = () => selector ? selector(initialState) : initialState;

  const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  if (selector) {
    type TargetProps = keyof ReturnType<typeof getBoard>;
    type TargetValue = ReturnType<typeof getBoard>[typeof target];

    const target =
      selector.toString().split(".").at(1) as TargetProps
      ?? selector?.toString().split(/[\[\]\"]+/).at(1) as TargetProps;

    const setTargetBoard = (value: TargetValue | ((prev: TargetValue) => TargetValue)) => {
      if (typeof value === "function") {
        setBoard((prev) => {
          return {
            ...prev,
            [target]: (value as (prev: TargetValue) => TargetValue)(prev[target]),
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