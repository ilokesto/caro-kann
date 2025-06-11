import type { CheckStoreType, Store, StoreType, storeTypeTag, Create, MiddlewareStore, ReactNode } from "../types";
import { context_props, store_props } from "../types";
import { createContext, useContext } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./CreateUseStore";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);
  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector: (state: T) => S = (state: T) => state as any){
    const store = useContext(ContextStore);

    return createUseStore<T, S>(store, selector);
  }

  useStore[context_props] = ContextStore;
  useStore[store_props] = store;
  
  const dummy = {}

  useStore.readOnly = <S,>(selector: (state: T) => S = (state: T) => state as any): S => useStore(selector)[0];
  useStore.writeOnly = () => useStore(() => dummy)[1];

  useStore.Provider = function<PK extends Array<StoreType>>({ store, children }: { 
    store: {
      store: CheckStoreType<K, PK, Store<T>>;
      [storeTypeTag]: PK;
    }; 
    children: ReactNode; 
  }) {
    return <ContextStore.Provider value={store.store as Store<T>}>{children}</ContextStore.Provider>;
  };

  return useStore;
}