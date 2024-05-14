import { createContext, useContext, useSyncExternalStore } from "react";
import { Board, setBoard } from "./Types";
import createBoard from "./funcs/createBoard";

export const playTartakower = <T>(initialState: T) => {
  const Board = createContext<Board<T>>(createBoard(initialState));

  function useBoard(): [T, setBoard<T>];
  function useBoard<S>(selector: (state: T) => S): [S, setBoard<T>];

  function useBoard<S>(selector?: (state: T) => S) {
    const { getBoard, setBoard, subscribe } = useContext(Board);

    const notationSnapshot = () => (selector ? selector(getBoard()) : getBoard());

    const board = useSyncExternalStore(subscribe, notationSnapshot, notationSnapshot);

    return [board, setBoard] as const;
  }

  return useBoard;
};
