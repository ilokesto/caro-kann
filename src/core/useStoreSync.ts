import { useContext, Context, useSyncExternalStore } from "react";
import type { Store, UseSyncStore } from "../types";

export const useStoreSync: UseSyncStore = <T, S>(Board: Context<Store<T>>, selector?: (value: T) => S): any => {
  const { getBoard, setBoard, subscribe, getInitState } = useContext(Board);
  const snapshot = (fn: () => T) => () => selector ? selector(fn()) : fn();
  const board = useSyncExternalStore(subscribe, snapshot(getBoard), snapshot(getInitState));  
  return [board, setBoard] as const
}