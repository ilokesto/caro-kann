import { CheckStoreType, Store, StoreType, storeTypeTag, UseStore, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, useContext } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./createUseStore";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  const useStore = createUseStore<T>(() => useContext(ContextStore)) as UseStore<T, K>;

  useStore.store = store

  useStore.Provider = function<PK extends Array<StoreType>>({ store, children }: { 
    store: {
      store: CheckStoreType<K, PK, Store<T>>;
      [storeTypeTag]: PK;
    }; 
    children: ReactNode; 
  }) {
    return <ContextStore.Provider value={store.store}>{children}</ContextStore.Provider>;
  };

  return useStore;
}