import { useContext, Context, useSyncExternalStore } from "react";
import type { Store, UseSyncStore } from "../types";
import { setNestedStore } from "../utils/setNestedStoreUtils";

export const useStoreSync: UseSyncStore =
  <T, S>({
    Store,
    storeTag,
  }: {
    Store: Context<Store<T>>;
    storeTag?: string;
  }) =>
  (selector: (state: T) => S = (state: T) => state as unknown as S): any => {
    const { getStore, setStore, subscribe, getInitState } = useContext(Store);

    const board = useSyncExternalStore(
      subscribe,
      () => selector(getStore()),
      () => selector(getInitState()),
    );

    if (storeTag === "zustand") return board;

    if (selector && storeTag !== "reducer")
      return [
        board,
        setNestedStore(setStore, selector),
        setStore,
      ] as const;
    else return [board, setStore] as const;
  };
