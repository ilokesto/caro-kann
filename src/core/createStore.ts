import type { Store, SetStateAction } from "../types";

export class CreateStore<T> implements Store<T> {
  private store: T;
  private callbacks: Set<() => void> = new Set();

  constructor(initState: T) { this.store = initState };

  getStore = () => this.store;

  setStore = (nextState: SetStateAction<T>) => {
    this.store = typeof nextState === "function"
      ? (nextState as (prev: T) => T)(this.store)
      : nextState;

    this.callbacks.forEach((cb) => cb());
  }

  subscribe = (callback: () => void) => {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }
}