import { MiddlewareStore, StoreType, storeTypeTag, Dispatch, ReactNode, ReactElement, SetStateAction, Context } from "../types";
export type GetFirstIndex<K extends Array<StoreType>> = K extends [infer F extends StoreType, ...infer R extends Array<StoreType>] ? F : false;
export type CheckStoreType<K extends Array<StoreType>, PK extends Array<StoreType>, U> = GetFirstIndex<K> extends 'reducer' ? GetFirstIndex<PK> extends 'reducer' ? U : "Warning: Reducer usage must be consistent. Both should use reducers, or neither should." : GetFirstIndex<PK> extends 'reducer' ? "Warning: Reducer usage must be consistent. Both should use reducers, or neither should." : U;
export interface Store<T, S = SetStateAction<T>> {
    setStore: (nextState: S, actionName?: string) => void;
    getStore: (init?: 'init') => T;
    subscribe: (callback: () => void) => () => void;
}
export declare const context_props: unique symbol;
export declare const store_props: unique symbol;
export type UseStore<T, K extends Array<StoreType> = [], TAction = SetStateAction<T>> = {
    (): readonly [T, Dispatch<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
    readOnly: {
        (): T;
        <S>(selector?: (state: T) => S): S;
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
    <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): UseStore<T, K>;
    <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): UseStore<T, K, A>;
    <T>(initState: T): UseStore<T>;
};
export type CreateStoreForProvider = {
    <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A>): {
        store: Store<T, A>;
        [storeTypeTag]: K;
    };
    <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K>): {
        store: Store<T>;
        [storeTypeTag]: Array<StoreType>;
    };
    <T>(initState: T): {
        store: Store<T>;
        [storeTypeTag]: Array<StoreType>;
    };
};
