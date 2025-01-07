import { createZustandStore } from "../core/createZustandStore";
import { Store } from "../types";

export function zustand<T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Omit<Store<T>, "getInitState">) => T): [Store<T>, "zustand"] {
  return [createZustandStore(initFn), "zustand"];
}