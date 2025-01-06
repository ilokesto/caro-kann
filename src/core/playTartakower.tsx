import type { Board, UseBoard } from "../types";
import { createContext, ReactNode } from "react";
import { createBoard } from "./createBoard";
import { useStore } from "./useStore";
import { createSetTargetBoard } from "../funcs/createSetTargetBoard";

function isBoard<T>(initState: T | Board<T>): initState is Board<T> {
  return (initState as Board<T>).getBoard !== undefined;
}

export function playTartakower<T>(initState: T | Board<T>) {
  const Board = createContext<Board<T>>(isBoard(initState) ? initState : createBoard(initState));

  const useBoard: UseBoard<T> = <S,>(selector?: (state: T) => S): any => {
    const [board, setBoard] = selector ? useStore(Board, selector) : useStore(Board);

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
