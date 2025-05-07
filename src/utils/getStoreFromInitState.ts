import { createStore } from "../core/createStore";
import { MiddlewareStore, storeTypeTag } from "../types";

const isMiddlewareStore = <T>(initState: T | MiddlewareStore<T, string>): initState is MiddlewareStore<T, string> => {
  return typeof initState === 'object' ? Reflect.has((initState as object), storeTypeTag) : false
}

export const getStoreFromInitState = <T>(initState: T | MiddlewareStore<T, string>) => isMiddlewareStore(initState) ? initState.store : createStore(initState);
