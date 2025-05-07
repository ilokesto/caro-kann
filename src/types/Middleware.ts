import { MigrationFn, PersistConfig } from "./PersistConfig";
import { Store } from "./";
import { SetStateAction } from "react";

export const storeTypeTag: unique symbol = Symbol("storeTypeTag")

export type MiddlewareStore<
  TInitState,
  TStoreType = "devtools" | "persist" | "reducer" | "zustand" | "validate" | "debounce" | "logger",
  TSetStore = SetStateAction<TInitState>
> = {
  store: Store<TInitState, TSetStore>,
  [storeTypeTag]: TStoreType
}

export type Validator<T> = {
  validate: (state: T) => boolean;
  formatError?: (state: T) => unknown;
};

export type Middleware = {
  devtools: <T>(initState: T | MiddlewareStore<T>, name: string)
    => MiddlewareStore<T, "devtools">;

  persist: <T, P extends Array<MigrationFn>>(initState: T | MiddlewareStore<T>, persistConfig: PersistConfig<T, P>)
    => MiddlewareStore<T, "persist">;

  reducer: <T, A extends object>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T>)
    => MiddlewareStore<T, "reducer", A>;

  zustand: <T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Store<T>) => T)
    => MiddlewareStore<T, "zustand">;

  debounce: <T>(initState: T | MiddlewareStore<T>, wait?: number)
  => MiddlewareStore<T, "debounce">;

  logger: <T>(initState: T | MiddlewareStore<T>, options?: { collapsed?: boolean, diff?: boolean })
    => MiddlewareStore<T, "logger">;

  validate: (<T>(initState: T | MiddlewareStore<T>, validator: Validator<T>)
    => MiddlewareStore<T, "validate">) & {
      zod: <T>(schema: import("zod").ZodSchema<T>) => Validator<T>;
      yup: <T>(schema: import("yup").Schema<T>) => Validator<T>;
      superstruct: <T>(schema: import("superstruct").Struct<T, any>) => Validator<T>;
    };
}