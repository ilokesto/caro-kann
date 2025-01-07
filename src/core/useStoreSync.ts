import { useContext, Context, useSyncExternalStore } from "react";
import type { Store, UseSyncStore } from "../types";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";

export const useStoreSync: UseSyncStore =
  <T, S>({ Store, storeTag }: { Store: Context<Store<T>>, storeTag?: string }) =>
  (selector?: (value: T) => S): any => {
    const { getStore, setStore, subscribe, getInitState} = useContext(Store);

    const snapshot = (fn: () => T) => () => selector ? selector(fn()) : fn();

    const board = useSyncExternalStore(
      subscribe,
      snapshot(getStore),
      snapshot(getInitState)
    );

    if (storeTag === "zustand") return board;

    if (selector && storeTag !== "reducer") return [
      board,
      createSetTargetBoard(setStore, selector),
      setStore,
    ] as const;
    else return [board, setStore] as const;
  };
