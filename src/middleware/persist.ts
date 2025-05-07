import { Middleware, MiddlewareStore, MigrationFn, PersistConfig, storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const persist: Middleware["persist"] = <T, P extends Array<MigrationFn>>(initState: T | MiddlewareStore<T>, options: PersistConfig<T, P>) => {
  const Store = getStoreFromInitState(initState);
  const optionObj = parseOptions(options);

  const initialState = optionObj.storageType
    ? getStorage({ ...optionObj, initState: Store.getInitState() }).state
    : Store.getInitState();
  Store.setStore(initialState);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "setStore") => {
    // @ts-ignore
    Store.setStore(nextState, actionName);

    if (optionObj.storageType)
      setStorage({ ...optionObj, value: Store.getStore() });
  };

  return {
    store: {...Store, setStore },
    [storeTypeTag]: "persist"
  }
};