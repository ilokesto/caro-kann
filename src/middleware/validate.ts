import { ValidateSchema } from "common-resolver/types";
import { Middleware, MiddlewareStore, StoreType, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { getResolver } from "common-resolver/getResolver";

export const validate: Middleware["validate"] = <T, K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>, validator: ValidateSchema<T>[keyof ValidateSchema<T>]) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
  const validateScheme = getResolver(validator);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "validate") => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    const { valid, error } = validateScheme.validate(newState);

    if (!valid) {
      console.error(`[Validation Error] Invalid state:`, error);
      return;
    }

    // @ts-ignore
    Store.setStore(newState, actionName);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["validate", ...storeTypeTagArray]
  };
};