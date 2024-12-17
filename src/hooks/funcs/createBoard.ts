import { CreateBoard } from "../types/Types";

export const createBoard: CreateBoard = (initState) => {
  type T = typeof initState;

  let board = initState;
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

