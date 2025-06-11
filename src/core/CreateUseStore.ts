import { useSyncExternalStore } from "react";
import type { SetStateAction, Store } from "../types";

export function createUseStore<T, S>(store: Store<T>, selector: (state: T) => S) {
  const { getStore, setStore, subscribe, getSelected, setSelected } = store;

  const isSelected = setSelected(selector);

  const board = useSyncExternalStore(
    subscribe,
    isSelected ? getSelected : () => selector(getStore()),
    isSelected ? getSelected : () => selector(getStore('init'))
  );

  return [
    board,
    (nextState: SetStateAction<T>) => setStore(nextState, "setStoreAction", selector)
  ] as const;
}