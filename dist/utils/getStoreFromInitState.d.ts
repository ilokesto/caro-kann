import { MiddlewareStore, StoreType, storeTypeTag } from "../types";
export declare const getStoreFromInitState: <T, K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>) => {
    store: import("../types").Store<T, import("react").SetStateAction<T>>;
    [storeTypeTag]: K;
};
