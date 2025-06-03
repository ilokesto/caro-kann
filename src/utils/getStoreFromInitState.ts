import { createStore } from "../core/createStore";
import { MiddlewareStore, StoreType, storeTypeTag } from "../types";

const isMiddlewareStore = <T, K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>): initState is MiddlewareStore<T, K> => {
  return typeof initState === 'object' ? Reflect.has((initState as object), storeTypeTag) : false
}

export const getStoreFromInitState = <T, K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>) => isMiddlewareStore(initState)
  ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
  : { store: createStore(initState), [storeTypeTag]: [] as unknown as K };
