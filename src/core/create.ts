import { StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create =<T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const {store, [storeTypeTag]: storeTag } = getStoreFromInitState<T, K>(initState);

  function useStore<S>(selector?: (state: T) => S) {
    const board = useSyncExternalStore(
      store.subscribe,
      () => selector ? selector(store.getStore()) : store.getStore(),
      () => selector ? selector(store.getInitState()) : store.getInitState()
    );

    return [board, store.setStore] as const;
  };

  useStore.derived = <S>(selector: (state: T) => S): S => useStore(selector)[0] as S;

  return useStore
}