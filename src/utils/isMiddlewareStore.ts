import { MiddlewareStore, storeTypeTag } from "../types";

export const isMiddlewareStore = <T>(initState: T | MiddlewareStore<T, string>): initState is MiddlewareStore<T, string> => {
  try { return storeTypeTag in (initState as object) }
  catch { return false }
}