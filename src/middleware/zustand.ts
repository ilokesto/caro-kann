import { createZustandStore } from "../core/createZustandStore";
import { Store } from "../types";

export function zustand<T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T) => T): Store<T> {
  return createZustandStore(initFn);
}