import { CheckStoreType, Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { createContext, ReactNode, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const create: Create = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T) => {
  const { store } = getStoreFromInitState<T, K>(initState);

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

  useStore.Provider = <PK extends Array<StoreType>>({ store, children }: { 
    store: {
      // GetFirstIndex<PK>의 조건을 Create 인터페이스의 기대와 일치시킴
      // 기대 : create에 reducer 안 썼으면 Provider에도 쓰지 마라
      store: CheckStoreType<K, PK, Store<T, React.SetStateAction<T>>>; 
      [storeTypeTag]: PK;
    }; 
    children: ReactNode 
  }) => {
    const {store: providerStore } = store;
    return <ContextStore.Provider value={providerStore}>{children}</ContextStore.Provider>;
  };

  return useStore;
}