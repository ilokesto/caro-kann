import { MiddlewareStore, storeTypeTag } from "../types";

export const isMiddlewareStore = <T>(initState: T | MiddlewareStore<T, string>): initState is MiddlewareStore<T, string> => {
  return typeof initState === 'object' ? Reflect.has((initState as object), storeTypeTag) : false
}