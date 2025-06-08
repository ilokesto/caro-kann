import { Dispatch, SetStateAction, useSyncExternalStore } from "react";
import { Store } from "../types";

export function createUseStore<T>(storeFn: () => Store<T>): {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
} {
  return  function useStore<S>(selector: (state: T) => S = (state: T) => state as any){
    const { getStore, setStore, subscribe, getSelected, setSelected } = storeFn();

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
      isSelected
        ? (nextState: SetStateAction<T>) => {
          setStore(nextState, "setStoreAction", selector)
        }
        : setStore
    ] as const;
  }
}