import type { Create, Store } from "../types";
import { createContext, ReactNode } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

function isStore<T>(initState: T | Store<T>): initState is Store<T> {
  return (initState as Store<T>).storeTag !== undefined;
}

export const create: Create = <T,>(initState: T): any => {
  const Store = createContext<Store<T>>(isStore(initState) ? initState : createStore(initState));

  const useStore = useStoreSync(Store);

  const useDerivedStore = <S,>(selector: (state: T) => S) => {
    return useStore(selector)[0];
  }

  const StoreContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Store.Provider value={createStore(value)}>{children}</Store.Provider>;
  };

  return isStore(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};