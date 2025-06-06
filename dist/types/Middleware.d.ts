import { MigrationFn, PersistConfig } from "./PersistConfig";
import { Store } from "./";
import { SetStateAction } from "react";
import { Resolver } from "common-resolver/types";
export declare const storeTypeTag: unique symbol;
export type StoreType = "devtools" | "persist" | "reducer" | "zustand" | "validate" | "debounce" | "logger";
export type MiddlewareStore<TInitState, K extends Array<StoreType> = [], TSetStore = SetStateAction<TInitState>> = {
    store: Store<TInitState, TSetStore>;
    [storeTypeTag]: K;
};
export type Middleware = {
    devtools: <T, K extends Array<StoreType> = []>(initState: T | MiddlewareStore<T, K>, name: string) => MiddlewareStore<T, ["devtools", ...K]>;
    persist: <T, K extends Array<StoreType> = [], P extends Array<MigrationFn> = []>(initState: T | MiddlewareStore<T, K>, persistConfig: PersistConfig<T, P>) => MiddlewareStore<T, ["persist", ...K]>;
    reducer: <T, K extends Array<StoreType> = [], A extends object = {}>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T, K>) => MiddlewareStore<T, ["reducer", ...K], A>;
    debounce: <T, K extends Array<StoreType> = []>(initState: T | MiddlewareStore<T, K>, wait?: number) => MiddlewareStore<T, ["debounce", ...K]>;
    logger: <T, K extends Array<StoreType> = []>(initState: T | MiddlewareStore<T, K>, options?: {
        collapsed?: boolean;
        diff?: boolean;
        timestamp?: boolean;
    }) => MiddlewareStore<T, ["logger", ...K]>;
    validate: <T, K extends Array<StoreType> = []>(initState: T | MiddlewareStore<T, K>, resolver: Resolver<T>) => MiddlewareStore<T, ["validate", ...K]>;
};
