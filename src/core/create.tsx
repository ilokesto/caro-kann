import { CheckStoreType, Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: CheckStoreType<K, MiddlewareStore<T, K> | T>) => {
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

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0] as S;

  useStore[storeTypeTag] = storeTag;

  useStore.Provider = ({ store, children }: { store: {
      store: Store<T, React.SetStateAction<T>>;
      [storeTypeTag]: K;
  }; children: ReactNode }) => {
    const {store: providerStore, [storeTypeTag]: providerStoreTag } = store;
    return <ContextStore.Provider value={providerStore}>{children}</ContextStore.Provider>;
  };

  return useStore;
}

export const createStore = <T, K extends Array<StoreType> = never>(initState: MiddlewareStore<T, K> | T) => getStoreFromInitState<T, K>(initState)
