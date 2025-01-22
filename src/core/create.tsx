import { storeTypeTag, type Create, type MiddlewareStore } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";

export const create: Create= <T,>(initState: T | MiddlewareStore<T, string>): any => {
  return isMiddlewareStore(initState)
  ? useStoreSync({ Store: initState.store, storeTag: initState[storeTypeTag]})
  : useStoreSync({ Store: createStore(initState)});
}; 