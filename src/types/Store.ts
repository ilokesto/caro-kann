import type { Context, ReactNode } from "react";
import type { Options } from ".";

export type Create = {
  <T>(initState: Store<T>): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S },
  <T>(initState: T): { useStore: UseStore<T>, useDerivedStore: <S>(selector: (state: T) => S) => S, StoreContext: ({ value, children }: { value: T; children: ReactNode }) => JSX.Element }
}

export interface Store<T> {
  storeTag: 'normal' | 'persist' | 'zustand' | 'reducer';
  getStore: () => T;
  setStore: SetStore<T>;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;  
}

export type SetStore<T> = (action: T | ((prev: T) => T)) => void

export type CreateStore = <T>(initValue: T, options?: Options<T>) => Store<T>;

export type UseStore<T> = {
    (): readonly [T, SetStore<T>];
    <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
}

export type UseSyncStore = {
  <T>(Board: Context<Store<T>>): {
    (): readonly [T, SetStore<T>],
    <S>(selector: (value: T) => S): readonly [S, SetStore<S>, SetStore<T>]
  };
}
