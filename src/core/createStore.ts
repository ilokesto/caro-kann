import type { Store, SetStateAction } from "../types";

// export class CreateStore<T> implements Store<T> {
//   private store: T;
//   private callbacks: Set<() => void> = new Set();

//   constructor(initState: T) { this.store = initState };

//   getStore() { return this.store; }

//   setStore(nextState: SetStateAction<T>) {
//     this.store = typeof nextState === "function"
//       ? (nextState as (prev: T) => T)(this.store)
//       : nextState;

//     this.callbacks.forEach((cb) => cb());
//   }

//   subscribe(callback: () => void) {
//     this.callbacks.add(callback);
//     return () => this.callbacks.delete(callback);
//   }
// }

export function createStore<T>(initState: T): Store<T> {
  let store: T = initState;
  const callbacks: Set<() => void> = new Set();

  return {
    getStore: () => store,
    setStore: (nextState: SetStateAction<T>) => {
      store = typeof nextState === "function"
        ? (nextState as (prev: T) => T)(store)
        : nextState;

      callbacks.forEach((cb) => cb());
    },
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    }
  };
}