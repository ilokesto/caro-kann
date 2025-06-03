import { Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const {store, [storeTypeTag]: storeTag } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector?: (state: T) => S) {
    const { getStore, setStore, getInitState, subscribe } = useContext(ContextStore);

    const board = useSyncExternalStore(
      subscribe,
      () => selector ? selector(getStore()) : getStore(),
      () => selector ? selector(getInitState()) : getInitState()
    );

    return [board, setStore] as const;
  };
  useStore.derived = <S>(selector: (state: T) => S): S => useStore(selector)[0] as S;
  useStore[storeTypeTag] = storeTag;

  return useStore;
}