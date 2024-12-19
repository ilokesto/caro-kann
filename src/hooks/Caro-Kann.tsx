import { createContext, ReactNode } from "react";
import { Board, SetStore } from "./types";
import { useStore } from "./funcs/useStore";
import { createBoard } from "./funcs/createBoard";

export function playTartakower<T>(initialState: T) {
  const Board = createContext<Board<T>>(createBoard(initialState));

  function useBoard(): readonly [T, SetStore<T>];
  function useBoard<S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
  function useBoard<S>(selector?: (state: T) => S): any {
    return selector ? useStore(initialState, Board, selector) : useStore(initialState, Board);
  };

  const useDerivedBoard = <S,>(selector: (state: T) => S) => {
    return useStore(initialState, Board, selector)[0]
  }

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, useDerivedBoard, BoardContext };
};
