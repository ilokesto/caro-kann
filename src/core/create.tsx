import { CheckStoreType, Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, SetStateAction, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

  const ContextStore = createContext<Store<T>>(store);

  function useStore<S>(selector: (state: T) => S = (state: T) => state as any){
    const { getStore, setStore, getInitState, subscribe, getSelected, setSelected } = useContext(ContextStore);

    const s = selector(getStore())
    const isSelected = typeof s === 'object'

    if (isSelected) setSelected(s)

    const board = useSyncExternalStore(
      subscribe,
      isSelected ? getSelected : () => selector(getStore()),
      isSelected ? getSelected : () => selector(getInitState())
    );

    return [
      board,
      isSelected
        ? (nextState: SetStateAction<T>) => setStore(nextState, "setStoreAction", selector)
        : setStore
    ] as const;
  };

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