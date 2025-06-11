import { MiddlewareStore, StoreType, storeTypeTag, Dispatch, ReactNode, ReactElement, SetStateAction, Context } from "../types";
  
export type GetFirstIndex<K extends Array<StoreType>> = K extends [infer F extends StoreType, ...infer R extends Array<StoreType>]
  ? F
  : false;

export type CheckStoreType<K extends Array<StoreType>, PK extends Array<StoreType>, U> =
  GetFirstIndex<K> extends 'reducer'
    ? GetFirstIndex<PK> extends 'reducer'
      ? U // 'reducer'로 일치
      : "Warning: Reducer usage must be consistent. Both should use reducers, or neither should." // 불일치
    : GetFirstIndex<PK> extends 'reducer'
      ? "Warning: Reducer usage must be consistent. Both should use reducers, or neither should." // 불일치
      : U; // 'reducer'가 아닌 거로 일치

export interface Store<T, S = SetStateAction<T>> {
  setStore: (nextState: S, actionName?: string, selector?: (state: T) => any) => void;
  getStore: (init?: 'init') => T;
  getSnapshot: <S>(selector: (state: T) => S) => S;
  subscribe: (callback: () => void) => () => void;
};

export const context_props: unique symbol = Symbol("context_props")
export const store_props: unique symbol = Symbol("store_props")

export type UseStore<T, K extends Array<StoreType> = [], TAction = SetStateAction<T>> = {
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
    readOnly: {
      (): T;
      <S>(selector?: (state: T) => S): S
    };
    writeOnly(): Dispatch<TAction>;
    Provider: <PK extends Array<StoreType>>({ store, children }: {
      store: {
        store: CheckStoreType<K, PK, Store<T, TAction>>;
        [storeTypeTag]: PK;
      };
      children: ReactNode;
    }) => ReactElement;
    [store_props]: Store<T, TAction>;
    [context_props]: Context<Store<T, TAction>>;
};

export type Create = {
  // middleware persist & devtools
  <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): UseStore<T, K>

  // middleware reducer
  <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): UseStore<T, K, A>

  // create
  <T>(initState: T): UseStore<T>
};

export type CreateStoreForProvider = {
  <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): { store: Store<T, A>, [storeTypeTag]: K },
  <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): { store: Store<T>, [storeTypeTag]: Array<StoreType> },
  <T>(initState: T): { store: Store<T>, [storeTypeTag]: Array<StoreType> }
}