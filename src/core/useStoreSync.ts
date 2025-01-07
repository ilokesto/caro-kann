import { useContext, Context, useSyncExternalStore } from "react";
import type { Store, UseSyncStore } from "../types";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";

export const useStoreSync: UseSyncStore = <T, S>(Board: Context<Store<T>>) => (selector?: (value: T) => S): any => {
  const { getBoard, setBoard, subscribe, getInitState, storeTag } = useContext(Board);
  const snapshot = (fn: () => T) => () => selector ? selector(fn()) : fn();
  const board = useSyncExternalStore(subscribe, snapshot(getBoard), snapshot(getInitState));

  if (["zustand", "reducer"].includes(storeTag)) return board;
  
  if (selector) return [board, createSetTargetBoard(setBoard, selector), setBoard] as const;
  else return [board, setBoard] as const;
}