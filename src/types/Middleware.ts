import { PersistConfig } from "./PersistConfig";
import { ReplacePropertyValue, Roll, Dispatcher, Store } from "./";

export type Middleware = {
  devtools: <T>(initState: T | [Store<T>, string], name: string)
    => [Store<T>, "devtools"];
  persist: <T>(initState: T | [Store<T>, string], persistConfig: PersistConfig<T>)
    => [Store<T>, "persist"];
  reducer: <T>(reducer: (state: T, action: Roll<Parameters<Dispatcher>[0]>) => T, initState: T | [Store<T>, string])
    => [ReplacePropertyValue<Store<T>, { setStore: Dispatcher }>, "reducer"];
  zustand: <T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Store<T>) => T)
    => [Store<T>, "zustand"];
}