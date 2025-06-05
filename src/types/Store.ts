import { Dispatch, JSX, ReactNode, SetStateAction } from "react";
import { MiddlewareStore, StoreType, storeTypeTag } from "./Middleware";

type IsInclude<K extends Array<StoreType>, U extends StoreType> = K extends [infer F, ...infer R extends Array<StoreType>]
  ? F extends U
    ? true
    : IsInclude<R, U>
  : false;

type IsReducerTagLocatedRightPlace<K extends Array<StoreType>> =
  IsInclude<K, "reducer"> extends true
    ? K extends [infer F, ...infer R]
      ? F extends "reducer"
        ? true
        : false
      : false
    : true;

export type CheckStoreType<K extends Array<StoreType>, U> = IsReducerTagLocatedRightPlace<K> extends true ? U : never;

export interface Store<T, S = SetStateAction<T>> {
  setStore: Dispatch<S>;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
};

export type UseStore<T, K extends Array<StoreType> = [], TAction = unknown> = {
  basic: {
    [storeTypeTag]: K;
    (): readonly [T, Store<T>["setStore"]];
    <S>(selector: (state: T) => S): readonly [
      S,
      Store<T>["setStore"]
    ];
    derived: <S>(selector: (state: T) => S) => S;
    Provider: ({ store, children }: {
      store: {
        store: Store<T, React.SetStateAction<T>>;
        [storeTypeTag]: K;
      };
      children: ReactNode;
    }) => JSX.Element
  };
  reducer: {
    [storeTypeTag]: K;
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
    derived: <S>(selector: (state: T) => S) => S;
    Provider: ({ store, children }: {
      store: {
        store: Store<T, React.SetStateAction<T>>;
        [storeTypeTag]: K;
      };
      children: ReactNode;
    }) => JSX.Element
  };
};

export type Create = {
  // middleware persist & devtools
  <T, K extends Array<StoreType> = []>(initState: MiddlewareStore<T, K>): UseStore<T, K>["basic"]

  // middleware reducer
  <T, K extends Array<StoreType> = [], A = never>(initState: MiddlewareStore<T, K, A>): UseStore<T, K, A>["reducer"]

  // create
  <T>(initState: T): UseStore<T>["basic"]
};

export type CreateStoreForProvider = {
  <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): {
      store: Store<T, React.SetStateAction<T>>;
      [storeTypeTag]: K;
  };
  <T>(initState: T): {
      store: Store<T, React.SetStateAction<T>>;
      [storeTypeTag]: [];
  };
}