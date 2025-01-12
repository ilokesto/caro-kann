// @ts-nocheck
import type { Create, Store } from "../types";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = <T,>(initState: T | [Store<T>, string]): any => {
  const useStore = useStoreSync({
    Store: initState[0] ?? createStore(initState),
    storeTag: initState[1],
  });

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0];

  return useStore;
};