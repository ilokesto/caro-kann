import { createContext, useContext } from "react";
import type { CheckStoreType, Create, MiddlewareStore, ReactNode, Store, StoreType, storeTypeTag } from "../types";
import { context_props, store_props } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./CreateUseStore";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);
  const ContextStore = createContext<Store<T>>(store);

  const useStore = Object.assign(
    <S,>(selector: (state: T) => S = (state: T) => state as any) => {
      const store = useContext(ContextStore);
      return createUseStore(store, selector);
    },
    {
      [context_props]: ContextStore,
      [store_props]: store,
      writeOnly: () => useContext(ContextStore).setStore,
      readOnly: <S,>(selector: (state: T) => S = (state: T) => state as any): S => useStore(selector)[0],
      Provider: <PK extends Array<StoreType>>({ 
        store, 
        children 
      }: { 
        store: {
          store: CheckStoreType<K, PK, Store<T>>;
          [storeTypeTag]: PK;
        }; 
        children: ReactNode; 
      }) => <ContextStore.Provider value={store.store as Store<T>}>{children}</ContextStore.Provider>
    }
  );

  return useStore;
}