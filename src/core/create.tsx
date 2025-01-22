// @ts-nocheck
import { storeTypeTag, type Create, type MiddlewareStore, type Store } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = <T, A>(initState: T | MiddlewareStore<T, string, A>): any => {
  const useStore = useStoreSync({
    Store: isMiddlewareStore(initState) ?  initState.store : createStore(initState),
    storeTag: isMiddlewareStore(initState) ? initState[storeTypeTag] : undefined,
  });

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0];


  return useStore;
};