import { useSyncExternalStore } from "react";
import { storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";

export const create: Create= <T,>(initState: T | MiddlewareStore<T, string>): any => {
  const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState)
  const storeTag = isMiddlewareStore(initState) ? initState[storeTypeTag] : "basic"

  function useStore<S>(selector: (state: T) => S = (state: T) => state as unknown as S): any {
    const board = useSyncExternalStore(
      Store.subscribe,
      () => selector(Store.getStore()),
      () => selector(Store.getInitState()),
    ); 

    if (storeTag === "zustand") return board;

    if (selector && storeTag !== "reducer")
      return [
        board,
        setNestedStore(Store.setStore, selector),
        Store.setStore,
      ] as const;
    else return [board, Store.setStore] as const;
  };

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0];

  return useStore
}