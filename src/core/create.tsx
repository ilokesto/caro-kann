import type { Create, Store, StoreContext, UseDerivedStore } from "../types";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = (initState): any => {
  type T = typeof initState extends [Store<infer T>, string] ? T : typeof initState;
  
  // @ts-expect-error
  const Store = createContext<Store<T>>(initState[0] ?? createStore(initState));

  // @ts-expect-error
  const useStore = useStoreSync({ Store, storeTag: initState[1] });

  const useDerivedStore: UseDerivedStore<T> = (selector) =>
    useStore(selector)[0];

  const StoreContext: StoreContext<T> = ({ value, children, }) =>
    <Store.Provider value={createStore(value)}>{children}</Store.Provider>

  return { useStore, useDerivedStore, StoreContext };
};