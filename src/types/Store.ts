import { Dispatch, JSX, ReactNode, SetStateAction } from "react";
import { MiddlewareStore, StoreType, storeTypeTag } from "./Middleware";

export const selected: unique symbol = Symbol("selected")
  
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
  setStore: (nextState: S, actionName?: string, selector?: (state: T) => any) => void;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
  setSelected: (value: any) => void;
  getSelected: () => any;
};

export type UseStore<T, K extends Array<StoreType> = [], TAction = SetStateAction<T>> = {
  basic: {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [
      S,
      Dispatch<SetStateAction<T>>
    ];
  } & UseStore<T, K, TAction>["Provider"];
  reducer: {
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
  } & UseStore<T, K, TAction>["Provider"];
  Provider: {
    Provider: <PK extends Array<StoreType>>({ store, children }: {
      store: {
        store: CheckStoreType<K, PK, Store<T, TAction>>;
        [storeTypeTag]: PK;
      };
      children: ReactNode;
    }) => JSX.Element
  }
};

export type Create = {
  // middleware persist & devtools
  <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): UseStore<T, K>["basic"]

  // middleware reducer
  <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): UseStore<T, K, A>["reducer"]

  // create
  <T>(initState: T): UseStore<T>["basic"]
};

export type CreateStoreFormProvider = {
  <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): { store: Store<T, A>, [storeTypeTag]: K },
  <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): { store: Store<T>, [storeTypeTag]: Array<StoreType> },
  <T>(initState: T): { store: Store<T>, [storeTypeTag]: Array<StoreType> }
}