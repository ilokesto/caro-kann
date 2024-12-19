import { createContext, ReactNode } from "react";
import { Board, SetStore } from "./types";
import { createBoard } from "./funcs/createBoard";
import { parseObjectPath } from "./funcs/parseObjectPath";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/syncBoard";

export function playTartakower<T>(initialState: T) {
  const Board = createContext<Board<T>>(createBoard(initialState));

  function useBoard(): readonly [T, SetStore<T>];
  function useBoard<S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
  function useBoard<S>(selector?: (state: T) => S): any {
    const [board, setBoard] = useStore(Board, initialState, selector);

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
