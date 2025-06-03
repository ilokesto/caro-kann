import { Dispatch, SetStateAction } from "react";
import { MiddlewareStore, StoreType } from "./Middleware";

export interface Store<T, S = SetStateAction<T>> {
  setStore: Dispatch<S>;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
};

export type UseStore<T, TAction = unknown> = {
  basic: {
    (): readonly [T, Store<T>["setStore"]];
    <S>(selector: (state: T) => S): readonly [
      S,
      Store<T>["setStore"]
    ];
    derived: <S>(selector: (state: T) => S) => S;
  };
  reducer: {
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
    derived: <S>(selector: (state: T) => S) => S;
  };
};

export type Create = {
  // middleware reducer
  <T, K extends Array<StoreType> = [], A = never>(initState: MiddlewareStore<T, K, A>): UseStore<T, A>["reducer"]

  // middleware persist & devtools
  <T, K extends Array<StoreType> = []>(initState: MiddlewareStore<T, K> | T): UseStore<T>["basic"]

  // create
  <T>(initState: T): UseStore<T>["basic"]
};
