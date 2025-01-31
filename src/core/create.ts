import { createStore } from "./createStore";
import { storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { useSyncExternalStore } from "react";

export const create: Create = (initState: any) => {
  type T = typeof initState extends MiddlewareStore<infer R> ? R : typeof initState
  const store = initState[storeTypeTag] ? initState.store : createStore(initState)
  const storeTag = initState[storeTypeTag] ? initState[storeTypeTag] : "basic"

  function useStore<S>(selector?: (state: T) => S) {
    const board = useSyncExternalStore(
      store.subscribe,
      () => selector ? selector(store.getStore()) : store.getStore(),
      () => selector ? selector(store.getInitState()) : store.getInitState());

    if (storeTag === "zustand") return board;
    if (selector && storeTag !== "reducer") {
      const { setNestedStore } = require("../utils/setNestedStoreUtils")
      return [board, setNestedStore(store.setStore, selector), store.setStore] as const
    }
    else return [board, store.setStore] as const;
  };

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0];

  return useStore
}