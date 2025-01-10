import { PersistConfig } from "./PersistConfig";
import { Dispatcher, Store } from "./Store";

export type Middleware = {
  Devtools: Devtools;
  Persist: Persist;
  Reducer: Reducer;
  Zustand: Zustand;
}

type Devtools = <T>(initState: T, name: string)
  => [Store<T>, "devtools"]

type Persist = <T>(initState: T, persistConfig: PersistConfig<T>)
  => [Store<T>, "persist"]

type Reducer = <T>(reducer: (state: T, action: Parameters<Dispatcher>[0]) => T, initState: T)
  => [Omit<Store<T>, "setStore"> & { setStore: Dispatcher }, "reducer"]

type Zustand = <T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Store<T>) => T)
  => [Store<T>, "zustand"]