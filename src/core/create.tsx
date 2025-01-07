import type { Create, Store } from "../types";
import { createContext, ReactNode } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = <T,>(initState: T | [Store<T>, "reducer" | "zustand" | "persist"]): any => {
  const Store = createContext<Store<T>>(initState instanceof Array ? initState[0] : createStore(initState));

  const useStore = useStoreSync({ Store, storeTag: initState instanceof Array ? initState[1] : undefined });

  const useDerivedStore = <S,>(selector: (state: T) => S) => {
    return useStore(selector)[0];
  }

  const StoreContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Store.Provider value={createStore(value)}>{children}</Store.Provider>;
  };

  return initState instanceof Array ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};