import type { Create, Store, ReturnTypeCreate } from "../types";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create = <T,>(initState: T | [Store<T>, string]): any => {
  const Store = createContext<Store<T>>(initState instanceof Array ? initState[0] : createStore(initState));

  const useStore = useStoreSync({ Store, storeTag: initState instanceof Array ? initState[1] : "basic" });

  const useDerivedStore: ReturnTypeCreate<T>["useDerivedStore"] = (selector) =>
    useStore(selector)[0];

  const StoreContext: ReturnTypeCreate<T>["StoreContext"] = ({ value, children, }) =>
    <Store.Provider value={createStore(value)}>{children}</Store.Provider>

  return { useStore, useDerivedStore, StoreContext };
};