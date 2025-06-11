import type { CheckStoreType, Store, StoreType, storeTypeTag, Create, MiddlewareStore, ReactNode, SetStateAction } from "../types";
import {context_props, store_props} from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector: (state: T) => S = (state: T) => state as any){
      const { getStore, setStore, subscribe, getSelected, setSelected } = useContext(ContextStore);
  
      const s = selector(getStore())
      const isSelected = typeof s === 'object';
  
      if (isSelected) setSelected(s);
  
      const board = useSyncExternalStore(
        subscribe,
        isSelected ? getSelected : () => selector(getStore()),
        isSelected ? getSelected : () => selector(getStore('init'))
      );
  
      return [
        board,
        (nextState: SetStateAction<T>) => setStore(nextState, "setStoreAction", selector)
      ] as const;
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