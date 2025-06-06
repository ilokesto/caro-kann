import { CheckStoreType, selected, Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, SetStateAction, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector?: (state: T) => S, overrideStore?: 'select-override') {
    const { getStore, setStore, getInitState, subscribe, getSelected } = useContext(ContextStore);

    const board = useSyncExternalStore(
      subscribe,
      overrideStore ? getSelected : () => selector ? selector(getStore()) : getStore(),
      overrideStore ? getSelected : () => selector ? selector(getInitState()) : getInitState()
    );

    const overrideSetStore = (nextState: SetStateAction<T>) => {
      // @ts-ignore
      setStore(nextState, selector)
    }

    return [board, overrideStore ? overrideSetStore : setStore] as const;
  };

  useStore.derived = <S,>(selector: (state: T) => S): S => useStore(selector)[0] as S;

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