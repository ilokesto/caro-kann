import { useSyncExternalStore } from "react";
import { storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";

export const create: Create= <T,>(initState: T | MiddlewareStore<T, string>): any => {
  const store = isMiddlewareStore(initState) ? initState.store : createStore(initState)
  const storeTag = isMiddlewareStore(initState) ? initState[storeTypeTag] : "basic"

  function useStore<S>(selector: (state: T) => S = (state: T) => state as unknown as S): any {
    const board = useSyncExternalStore(
      store.subscribe,
      () => selector(store.getStore()),
      () => selector(store.getInitState()),
    );

    if (storeTag === "zustand") return board;

    if (selector && storeTag !== "reducer")
      return [
        board,
        setNestedStore(store.setStore, selector),
        store.setStore,
      ] as const;
    else return [board, store.setStore] as const;
  };

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0];

  return useStore
}