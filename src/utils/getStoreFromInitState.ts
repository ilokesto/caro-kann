import type { CreateStoreForProvider, MiddlewareStore, StoreType, SetStateAction, Store } from "../types";
import { storeTypeTag } from "../types";
import { createStore } from "../core/createStore";

const isMiddlewareStore = <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: T | MiddlewareStore<T, K, A>): initState is MiddlewareStore<T, K, A> =>
  typeof initState === 'object' ? Reflect.has((initState as object), storeTypeTag) : false

export const getStoreFromInitState = <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: MiddlewareStore<T, K, A> | T) => isMiddlewareStore(initState)
  ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
  : { store:createStore(initState), [storeTypeTag]: [] as unknown as K };

export const createStoreForProvider: CreateStoreForProvider = <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A> | T) => isMiddlewareStore(initState)
  ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
  : { store: createStore(initState), [storeTypeTag]: [] as unknown as K };
