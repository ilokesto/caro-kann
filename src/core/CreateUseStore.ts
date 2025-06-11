import { useSyncExternalStore } from "react";
import type { SetStateAction, Store } from "../types";

export function createUseStore<T, S>(
  store: Store<T>,
  selector: (state: T) => S
) {
  const { getSnapshot, setStore, subscribe } = store;

    const board = useSyncExternalStore(
      subscribe,
      () => getSnapshot(selector),
      () => getSnapshot(selector)
  );

  return [
    board,
    (nextState: SetStateAction<T>) => {
      setStore(nextState, "setStoreAction", selector)
    }
  ] as const;
}