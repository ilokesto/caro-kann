import { CreateBoard } from "../Types";

const createBoard: CreateBoard = (initState) => {
  let board = initState;
  const callbacks = new Set<() => void>();
  const getBoard = () => board;

  type InitState = typeof initState;

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

export default createBoard;
