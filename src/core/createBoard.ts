import type { CreateBoard } from "../types";

export const createBoard: CreateBoard = (initState) => {
  const callbacks = new Set<() => void>();
  let board = initState;

  type T = typeof initState;
  const setBoard = (nextState: T | ((prev: T) => T)) => {
    board = typeof nextState === "function" ? (nextState as (prev: T) => T)(board) : nextState;

    callbacks.forEach((cb) => cb());
  };

  const getBoard = () => board;

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
