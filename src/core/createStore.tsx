import type { Store, UseStore } from "../types";
import { createContext, ReactNode } from "react";
import { createBoard } from "./createBoard";
import { useStoreSync } from "./useStoreSync";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";

function isBoard<T>(initState: T | Store<T>): initState is Store<T> {
  return (initState as Store<T>).getBoard !== undefined && (initState as Store<T>).setBoard !== undefined;
}

export function createStore<T>(initState: Store<T>): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S };
export function createStore<T>(initState: T): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S, BoardContext: ({ value, children }: { value: T; children: ReactNode }) => JSX.Element };
export function createStore<T>(initState: T) {
  const Board = createContext<Store<T>>(isBoard(initState) ? initState : createBoard(initState));

  const useStore: UseStore<T> = <S,>(selector?: (state: T) => S): any => {
    const [board, setBoard] = selector ? useStoreSync(Board, selector) : useStoreSync(Board);

    if (selector) return [board, createSetTargetBoard(setBoard, selector), setBoard] as const;
    else return [board, setBoard] as const;
  };

  const useDerivedStore = <S,>(selector: (state: T) => S) => {
    return useStoreSync(Board, selector)[0];
  }

  const BoardContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Board.Provider value={createBoard(value)}>{children}</Board.Provider>;
  };

  return isBoard(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, BoardContext };
};