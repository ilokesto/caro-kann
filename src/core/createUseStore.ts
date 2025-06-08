import { SetStateAction, useSyncExternalStore } from "react";
import { Store, StoreType, UseStore } from "../types";

export function createUseStore<T, K extends Array<StoreType> = []>(store: () => Store<T>) {
  return function useStore<S>(selector: (state: T) => S = (state: T) => state as any) {
    const { getStore, setStore, subscribe, getSelected, setSelected } = store();

    const s = selector(getStore())
    const isSelected = typeof s === 'object';

    if (isSelected) setSelected(s);

    const board = useSyncExternalStore(
      subscribe,
      isSelected ? getSelected : () => selector(getStore()),
      isSelected ? getSelected : () => selector(getStore('init'))
    );

    return [
      board,
      (nextState: SetStateAction<T>) => setStore(nextState, "setStoreAction", selector)
    ] as const;
  } as UseStore<T, K>;
}