import type { Board, Options, UseBoard } from "./types";
import { createContext, ReactNode } from "react";
import { createBoard } from "./funcs/createBoard";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/useStore";

export function playTartakower<T>(initState: T, options?: Options<T>) {
  const Board = createContext<Board<T>>(createBoard(initState, options));

  const useBoard: UseBoard<T> = <S,>(selector?: (state: T) => S): any => {
    const [board, setBoard] = useStore(Board, selector!);

    if (selector) return [board, createSetTargetBoard(setBoard, selector), setBoard] as const;
    else return [board, setBoard] as const;
  };

  const useDerivedBoard = <S,>(selector: (state: T) => S) => {
    return useStore(Board, selector)[0];
  }

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return { useBoard, useDerivedBoard, BoardContext };
};
