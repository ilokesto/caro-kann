import { CheckStoreType, selected, Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, SetStateAction, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector: (state: T) => S = (state: T) => state as any){
    const { getStore, setStore, getInitState, subscribe, getSelected, setSelected } = useContext(ContextStore);

    const a = selector(getStore())

    if (typeof a === 'object') setSelected(selector(getStore()))

    const board = useSyncExternalStore(
      subscribe,
      typeof a === 'object' ? getSelected : () => selector(getStore()),
      typeof a === 'object' ? getSelected : () => selector(getInitState())
    );

    const overrideSetStore = (nextState: SetStateAction<T>) => {
      // @ts-ignore
      setStore(nextState, "setStoreAction", selector)
    }

    return [board, typeof a === 'object' ? overrideSetStore : setStore] as const;
  };

  useStore.Provider = <PK extends Array<StoreType>>({ store, children }: { 
    store: {
      store: CheckStoreType<K, PK, Store<T, React.SetStateAction<T>>>; 
      [storeTypeTag]: PK;
    }; 
    children: ReactNode 
  }) => {
    const { store: providerStore } = store;
    return <ContextStore.Provider value={providerStore}>{children}</ContextStore.Provider>;
  };

  return useStore;
}