import { CreateBoard } from "../types";
import { getStorage } from "./storage/getStorage";
import { setStorage } from "./storage/setStorage";

export const createBoard: CreateBoard = (initState, options) => {
  type T = typeof initState;

  const storageKey = options?.local ?? options?.session ?? '';
  const storageType = options?.local ? 'local' : options?.session ? 'session' : null;
  const migrate = options?.migrate;
  const initialState = storageType ? getStorage(storageKey, storageType, initState, migrate).state : initState;

  let board = initialState;
  const callbacks = new Set<() => void>();
  const getBoard = () => board;

  const setBoard = (nextState: T | ((prev: T) => T)) => {
    board = typeof nextState === "function" ? (nextState as (prev: T) => T)(board) : nextState;
    if (storageType) {
      setStorage(storageKey, storageType, getBoard());
    }
    callbacks.forEach((cb) => cb());
  };

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
