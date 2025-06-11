import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import type { SetStateAction, Store } from "../types";

export function createUseStore<T, S>(
  { getStore, setStore, subscribe }: Store<T>,
  selector: (state: T) => S,
) {
  const board = useSyncExternalStoreWithSelector(
    subscribe,
    getStore,
    getStore,
    selector,
  );

  return [
    board,
    (nextState: SetStateAction<T>) => {
      setStore(nextState, "setStoreAction", selector)
    }
  ] as const;
}