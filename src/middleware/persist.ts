import type { Middleware, MiddlewareStore, MigrationFn, PersistConfig, StoreType } from "../types";
import { storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const persist: Middleware["persist"] = <T, K extends Array<StoreType>, P extends Array<MigrationFn>>(initState: T | MiddlewareStore<T, K>, options: PersistConfig<T, P>) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
  const optionObj = parseOptions(options);

  const initialState = optionObj.storageType
    ? getStorage({ ...optionObj, initState: Store.getStore() }).state
    : Store.getStore();
  Store.setStore(initialState);

  const setStore = (nextState: T | ((prev: T) => T), actionName?: string) => {
    Store.setStore(nextState, actionName);

    if (optionObj.storageType)
      setStorage({ ...optionObj, value: Store.getStore() });
  };

  return {
    store: {...Store, setStore },
    [storeTypeTag]: ["persist", ...storeTypeTagArray]
  }
};