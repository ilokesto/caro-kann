import { createContext, ReactNode } from "react";
import type { Board, SetStore, StorageConfig } from "./types";
import { createBoard } from "./funcs/createBoard";
import { parseObjectPath } from "./funcs/parseObjectPath";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/syncBoard";

export function playTartakower<T>(initialState: T, options?: StorageConfig) {
  const Board = createContext<Board<T>>(createBoard(initialState, options));

  function useBoard(): readonly [T, SetStore<T>];
  function useBoard<S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
  function useBoard<S>(selector?: (state: T) => S): any {
    const [board, setBoard] = selector ? useStore(Board, initialState, selector) : useStore(Board, initialState);

    if (selector) {
      const path = parseObjectPath(selector.toString());
      const setTargetBoard = createSetTargetBoard(setBoard, path, selector);

      return [board, setTargetBoard, setBoard] as const;
    } else {
      return [board, setBoard] as const;
    }
  };

  const useDerivedBoard = <S,>(selector: (state: T) => S) => {
    const [board] = useStore(Board, initialState, selector);

    return board;
  }

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, useDerivedBoard, BoardContext };
};
