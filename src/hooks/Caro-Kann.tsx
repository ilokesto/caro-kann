import { createContext, ReactNode } from "react";
import { Board, UseBoard } from "./types/Types";
import { useStore } from "./funcs/useStore";
import { createBoard } from "./funcs/createBoard";

export const playTartakower = <T,>(initialState: T) => {
  const Board = createContext<Board<T>>(createBoard(initialState));

  const useBoard: UseBoard<T> = <S,>(selector?: (state: T) => S) => {
    return selector ? useStore(Board, selector) : useStore(Board);
  };

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, BoardContext };
};
