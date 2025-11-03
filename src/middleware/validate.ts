import { Resolver } from "@ilokesto/common-resolver/types";
import type { Middleware, MiddlewareStore, StoreType } from "../types";
import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const validate: Middleware["validate"] = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T, resolver: Resolver<T>) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "validate") => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    const { valid, error } = resolver.validate(newState);

    if (!valid) {
      console.error(`[Validation Error] Invalid state:`, error);
      return;
    }

    Store.setStore(newState, actionName);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["validate", ...storeTypeTagArray]
  }
};