import { Dispatch, JSX, ReactNode, SetStateAction } from "react";
import { MiddlewareStore, StoreType, storeTypeTag } from "./Middleware";

type GetFirstIndex<K extends Array<StoreType>> = K extends [infer F extends StoreType, ...infer R extends Array<StoreType>]
  ? F
  : false;

export type CheckStoreType<K extends Array<StoreType>, PK extends Array<StoreType>, U> =
  GetFirstIndex<K> extends 'reducer'
    ? GetFirstIndex<PK> extends 'reducer'
      ? U // 'reducer'로 일치
      : never // 불일치
    : GetFirstIndex<PK> extends 'reducer'
      ? never // 불일치
      : U; // 'reducer'가 아닌 거로 일치

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
    Provider: <PK extends Array<StoreType>>({ store, children }: {
      store: {
        store: CheckStoreType<K, PK, Store<T, React.SetStateAction<T>>>;
        [storeTypeTag]: PK;
      };
      children: ReactNode;
    }) => JSX.Element
  };
  reducer: {
    [storeTypeTag]: K;
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
    derived: <S>(selector: (state: T) => S) => S;
    Provider: <PK extends Array<StoreType>>({ store, children }: {
      store: {
        store: CheckStoreType<K, PK, Store<T, React.SetStateAction<T>>>;
        [storeTypeTag]: PK;
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