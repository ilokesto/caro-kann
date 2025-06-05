import { Store, StoreType, storeTypeTag, type Create, type MiddlewareStore } from "../types";
export declare const create: Create;
export declare const createStore: <T, K extends Array<StoreType> = never>(initState: MiddlewareStore<T, K> | T) => {
    store: Store<T, import("react").SetStateAction<T>>;
    [storeTypeTag]: K;
};
