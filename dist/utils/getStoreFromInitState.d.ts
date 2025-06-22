import type { CreateStoreForProvider, MiddlewareStore, StoreType, SetStateAction, Store } from "../types";
import { storeTypeTag } from "../types";
export declare const getStoreFromInitState: <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: MiddlewareStore<T, K, A> | T) => {
    store: Store<T, A>;
    [storeTypeTag]: K;
} | {
    store: Store<T>;
    [storeTypeTag]: K;
};
export declare const createStoreForProvider: CreateStoreForProvider;
