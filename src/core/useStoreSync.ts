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

    switch (storeTag) {
      case "reducer":
        return [board, setStore] as const;

      case "zustand":
        return board;

      default:
        if (selector)
          return [
            board,
            // 일반적인 상황에서 중첩된 객체를 효율적으로 처리
            createSetTargetBoard(setStore, selector),
            setStore,
          ] as const;
        else return [board, setStore] as const;
    }
  };
