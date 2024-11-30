import { CreateBoard } from "../types/Types";

export const createBoard: CreateBoard = (initState) => {
  type InitState = typeof initState;

  let board = initState;
  const callbacks = new Set<() => void>();
  const getBoard = () => board;


  const setBoard = (nextState: InitState | ((prev: InitState) => InitState)) => {
    board = typeof nextState === "function" ? (nextState as (prev: InitState) => InitState)(board) : nextState;
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

