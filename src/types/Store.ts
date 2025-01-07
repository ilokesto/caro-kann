import type { Context, ReactNode } from "react";
import type { Options } from ".";

export type Create = {
  // middleware persist
  <T>(initState: [Store<T>, "persist"]): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S },
  // middleware reducer
  <T>(initState: [Store<T, Dispatcher<void>>, "reducer"]): { useStore: {
    (): readonly [T, Dispatcher<void>],
    <S>(selector: (state: T) => S): readonly [S, Dispatcher<void>],
  } },
  // middleware zustand
  <T>(initState: [Store<T>, "zustand"]): { useStore: {
    (): T,
    <S>(selector: (state: T) => S): S,
  } },
  // create
  <T>(initState: T): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S, StoreContext: ({ value, children }: { value: T; children: ReactNode }) => JSX.Element }
}

export interface Store<T, S = SetStore<T>> {
  getStore: () => T;
  setStore: S;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
}

export type SetStore<T> = (action: T | ((prev: T) => T)) => void

export type CreateStore = <T>(initValue: T, options?: Options<T>) => Store<T>;
export type reducerAction = { [x: string]: any, type: string };
export type Dispatcher<T> = (action: {[x: string]: any, type: string}) => T;
export type CreateReducerStore = <T>(reducer: (state: T, action: reducerAction) => T, store: Store<T>) => Store<T, Dispatcher<void>>;
export type CreatePersistStore = <T>(store: Store<T>, options: Options<T>) => Store<T>;

export type UseStore<T> = {
    (): readonly [T, SetStore<T>];
    <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
}

export type UseSyncStore = {
  <T>(props: { Store: Context<Store<T>>, storeTag: "reducer"}): {
    (): readonly [T, Dispatcher<void>],
    <S>(selector: (value: T) => S): readonly [S, Dispatcher<void>] 
  },
  <T>(props: { Store: Context<Store<T>>, storeTag?: string}): {
    (): readonly [T, SetStore<T>],
    <S>(selector: (value: T) => S): readonly [S, SetStore<S>, SetStore<T>]
  };
}
