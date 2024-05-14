import { CreateBoard } from "../Types";

const createBoard: CreateBoard = (initialState) => {
  let board = initialState;
  const callbacks = new Set<() => void>();
  const getBoard = () => board;

  type InivtialState = typeof initialState;

  const setBoard = (nextState: InivtialState | ((prev: InivtialState) => InivtialState)) => {
    board = typeof nextState === "function" ? (nextState as (prev: InivtialState) => InivtialState)(board) : nextState;
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
