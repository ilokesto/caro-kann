import { Context } from "react";

export type Dispatcher = (action: { [x: string]: any; type: string }) => void;

export type Store<T, S = (action: T | ((prev: T) => T)) => void> = {
  setStore: S;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
}

export type UseStore<T> = {
  basic: {
    (): readonly [T, Store<T>["setStore"]];
    <S>(selector: (state: T) => S): readonly [S, Store<S>["setStore"], Store<T>["setStore"]];
  },
  reducer: {
    (): readonly [T, Dispatcher];
    <S>(selector: (state: T) => S): readonly [S, Dispatcher];
  },
  zustand: {
    (): T;
    <S>(selector: (state: T) => S): S;
  },
}

export type UseSyncStore = {
  // middleware reducer
  <T>(props: { Store: Context<Store<T>>; storeTag: "reducer" }): UseStore<T>["reducer"];

  // middleware zustand
  <T>(props: { Store: Context<Store<T>>; storeTag: "zustand" }): UseStore<T>["zustand"];

  // create & middleware persist & devtools
  <T>(props: { Store: Context<Store<T>>; storeTag?: string }): UseStore<T>["basic"];
};

export type SetNestedBoard = <T, S>(setBoard: Store<T>["setStore"], selector: (value: T) => S) => (value: S | ((prev: S) => S)) => void;