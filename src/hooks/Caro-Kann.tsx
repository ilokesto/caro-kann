import { createContext, ReactNode } from "react";
import type { Board, StorageConfig, UseBoard } from "./types";
import { createBoard } from "./funcs/createBoard";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/syncBoard";

export function playTartakower<T>(initialState: T, options?: StorageConfig) {
  const Board = createContext<Board<T>>(createBoard(initialState, options));

  const useBoard: UseBoard<T> = <S,>(selector?: (state: T) => S): any => {
    const [board, setBoard] = selector ? useStore(Board, initialState, selector) : useStore(Board, initialState);

    if (selector) return [board, createSetTargetBoard(setBoard, selector), setBoard] as const;
    else return [board, setBoard] as const;
  };

  const useDerivedBoard = <S,>(selector: (state: T) => S) => {
    return useStore(Board, initialState, selector)[0];
  }

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, useDerivedBoard, BoardContext };
};
