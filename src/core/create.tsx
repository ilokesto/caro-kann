import type { Create, Store, UseStore } from "../types";
import { createContext, ReactNode } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";

function isStore<T>(initState: T | Store<T>): initState is Store<T> {
  return (initState as Store<T>).getBoard !== undefined && (initState as Store<T>).setBoard !== undefined;
}

export const create: Create = <T,>(initState: T): any => {
  const Store = createContext<Store<T>>(isStore(initState) ? initState : createStore(initState));

  const useStore: UseStore<T> = <S,>(selector?: (state: T) => S): any => {
    const [board, setBoard] = selector ? useStoreSync(Store, selector) : useStoreSync(Store);

    if (selector) return [board, createSetTargetBoard(setBoard, selector), setBoard] as const;
    else return [board, setBoard] as const;
  };

  const useDerivedStore = <S,>(selector: (state: T) => S) => {
    return useStoreSync(Store, selector)[0];
  }

  const StoreContext = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Store.Provider value={createStore(value)}>{children}</Store.Provider>;
  };

  return isStore(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};