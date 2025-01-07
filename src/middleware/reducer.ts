import { createReducerStore } from "../core/createReducerStore";
import { createStore } from "../core/createStore";
import { Store } from "../types";

export function reducer<T>(reducer: (state: T, action: { [x: string]: any, type: string }) => T, initialState: T): [Omit<Store<T>, "setStore"> & { setStore: (action: { [x: string]: any, type: string }) => void }, "reducer"] {
  return [createReducerStore(reducer, createStore(initialState)), "reducer"]
}