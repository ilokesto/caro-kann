import type { CreateStoreForProvider, MiddlewareStore, SetStateAction, StoreType } from "../types";
import { storeTypeTag } from "../types";
export declare const getStoreFromInitState: <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: MiddlewareStore<T, K, A> | T) => {
    store: import("../types").Store<T, A>;
    [storeTypeTag]: K;
} | {
    store: import("../types").Store<T, SetStateAction<T>>;
    [storeTypeTag]: K;
};
export declare const createStoreForProvider: CreateStoreForProvider;
