import { createContext, ReactNode } from "react";
import { Board, UseBoard } from "./types";
import { useStore } from "./funcs/useStore";
import { createBoard } from "./funcs/createBoard";

export function playTartakower<T>(initialState: T) {
  const Board = createContext<Board<T>>(createBoard(initialState));

  const useBoard: UseBoard<T> = <S,>(selector?: (state: T) => S) => {
    // if (selector && /[?&\[\]:|]/.test(selector.toString())) throw new Error("Invalid selector function");

    return selector ? useStore(initialState, Board, selector) : useStore(initialState, Board);
  };

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, BoardContext };
};
