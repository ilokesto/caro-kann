import { SetStateAction } from "react";
import type { Store } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;

  const setStore = (nextState: T | ((prev: T) => T)) => {
    store = typeof nextState === "function" ? (nextState as (prev: T) => T)(store) : nextState;

    callbacks.forEach((cb) => cb());
  };

  const getStore = () => store;

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getStore, setStore, subscribe, getInitState: () => initState };
};

export class CreateStore<T> implements Store<T> {
  private _callbacks = new Set<() => void>();
  private _store: T
  private _initStore: T

  constructor(initStore: T) {
    this._store = initStore;
    this._initStore = initStore;
  }

  public getInitState = () => this._initStore;

  public getStore = () => this._store;

  public setStore = (nextState: SetStateAction<T>) => {
    this._store = typeof nextState === "function" ? (nextState as (prev: T) => T)(this._store) : nextState;

    this._callbacks.forEach((cb) => cb());
  }

  public subscribe = (callback: () => void) => {
    this._callbacks.add(callback);
    return () => this._callbacks.delete(callback);
  };
}