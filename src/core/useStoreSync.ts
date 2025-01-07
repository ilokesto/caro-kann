import { useContext, Context, useSyncExternalStore } from "react";
import type { Store, UseSyncStore } from "../types";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";

export const useStoreSync: UseSyncStore =
  <T, S>(Board: Context<Store<T>>) =>
  (selector?: (value: T) => S): any => {
    const { getStore, setStore, subscribe, getInitState, storeTag } =
      useContext(Board);
    const snapshot = (fn: () => T) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(
      subscribe,
      snapshot(getStore),
      snapshot(getInitState)
    );

    if (["zustand", "reducer"].includes(storeTag)) return board;

    if (selector)
      return [
        board,
        createSetTargetBoard(setStore, selector),
        setStore,
      ] as const;
    else return [board, setStore] as const;
  };
