import { createContext, useContext, useSyncExternalStore } from "react";

type Board<T> = {
  getBoard: () => T;
  setBoard: (action: T | ((prev: T) => T)) => void;
  subscribe: (callback: () => void) => () => void;
};

const playTartakower = <T>(initialState: T) => {
  const createBoard = (initialState: T): Board<T> => {
    let board = initialState;
    const callbacks = new Set<() => void>();
    const getBoard = () => board;

    const setBoard = (nextState: T | ((prev: T) => T)) => {
      board = typeof nextState === "function" ? (nextState as (prev: T) => T)(board) : nextState;
      callbacks.forEach((callback) => callback());
    };

    const subscribe = (callback: () => void) => {
      callbacks.add(callback);

      return () => {
        callbacks.delete(callback);
      };
    };

    return { getBoard, setBoard, subscribe };
  };

  const Board = createContext<Board<T>>(createBoard(initialState));

  const useBoard = <S>(selector?: (state: T) => S) => {
    const { getBoard, setBoard, subscribe } = useContext(Board);

    const notationSnapshot = () => (selector ? selector(getBoard()) : getBoard());

    const board = useSyncExternalStore(subscribe, notationSnapshot, notationSnapshot);

    return [board as S, setBoard] as const;
  };

  return useBoard;
};

export default playTartakower;
