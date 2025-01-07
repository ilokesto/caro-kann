import type { Create, Store } from "../types";
import { createContext, ReactNode } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = <T,>(initState: T | [Store<T>, "reducer" | "zustand" | "persist"]): any => {
  // @ts-expect-error
  const Store = createContext<Store<T>>(initState[0] ?? createStore(initState));

  // @ts-expect-error
  const useStore = useStoreSync({ Store, storeTag: initState[1] });

  const useDerivedStore = <S,>(selector: (state: T) => S) => useStore(selector)[0];

  const StoreContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Store.Provider value={createStore(value)}>{children}</Store.Provider>;
  };

  return { useStore, useDerivedStore, StoreContext };
};