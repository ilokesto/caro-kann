import { MigrationFn, PersistConfig } from "./PersistConfig";
import { Store } from "./";
import { SetStateAction } from "react";
import { ValidateSchema } from "common-resolver/types";
export declare const storeTypeTag: unique symbol;
export type MiddlewareStore<TInitState, TStoreType = "devtools" | "persist" | "reducer" | "zustand" | "validate" | "debounce" | "logger", TSetStore = SetStateAction<TInitState>> = {
    store: Store<TInitState, TSetStore>;
    [storeTypeTag]: TStoreType;
};
export type Middleware = {
    devtools: <T>(initState: T | MiddlewareStore<T>, name: string) => MiddlewareStore<T, "devtools">;
    persist: <T, P extends Array<MigrationFn>>(initState: T | MiddlewareStore<T>, persistConfig: PersistConfig<T, P>) => MiddlewareStore<T, "persist">;
    reducer: <T, A extends object>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T>) => MiddlewareStore<T, "reducer", A>;
    zustand: <T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Store<T>) => T) => MiddlewareStore<T, "zustand">;
    debounce: <T>(initState: T | MiddlewareStore<T>, wait?: number) => MiddlewareStore<T, "debounce">;
    logger: <T>(initState: T | MiddlewareStore<T>, options?: {
        collapsed?: boolean;
        diff?: boolean;
        timestamp?: boolean;
    }) => MiddlewareStore<T, "logger">;
    validate: <T>(initState: T | MiddlewareStore<T>, validator: ValidateSchema<T>[keyof ValidateSchema<T>]) => MiddlewareStore<T, "validate">;
};
