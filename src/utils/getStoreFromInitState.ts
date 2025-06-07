import { SetStateAction } from "react";
import { createStore } from "../core/createStore";
import { CreateStoreForProvider, MiddlewareStore, StoreType, storeTypeTag } from "../types";

const isMiddlewareStore = <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: T | MiddlewareStore<T, K, A>): initState is MiddlewareStore<T, K, A> => {
  return typeof initState === 'object' ? Reflect.has((initState as object), storeTypeTag) : false
}

export const getStoreFromInitState = <T, K extends Array<StoreType>, A = SetStateAction<T>>(initState: MiddlewareStore<T, K, A> | T) => isMiddlewareStore(initState)
  ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
  : { store: createStore(initState), [storeTypeTag]: [] as unknown as K };

export const createStoreFormProvider: CreateStoreForProvider = <T, K extends Array<StoreType>, A extends object>(initState: MiddlewareStore<T, K, A> | T) => {
  return isMiddlewareStore(initState)
  ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
  : { store: createStore(initState), [storeTypeTag]: [] as unknown as K };
}