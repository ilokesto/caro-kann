import { CreateBoard } from "../types";
import { getStorage } from "./storage/getStorage";
import { parseOptions } from "./storage/parseOptions";
import { setStorage } from "./storage/setStorage";

export const createBoard: CreateBoard = (initState, options) => {
  const optionObj = parseOptions(options);
  const initialState = optionObj.storageType ? getStorage({...optionObj, initState }).state : initState;
  const callbacks = new Set<() => void>();
  let board = initialState;

  type T = typeof initState;
  const setBoard = (nextState: T | ((prev: T) => T)) => {
    board = typeof nextState === "function" ? (nextState as (prev: T) => T)(board) : nextState;
    
    if (optionObj.storageType) setStorage({ ...optionObj, value: board });

    callbacks.forEach((cb) => cb());
  };

  const getBoard = () => board;

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
