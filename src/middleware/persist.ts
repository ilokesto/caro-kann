import { createStore } from "../core/createStore";
import { Middleware, MiddlewareStore, PersistConfig, Store, storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";

export const persist: Middleware["persist"] = <T,>(initState: T | MiddlewareStore<T>, options: PersistConfig<T>) => {
  const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
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
    store: {...Store, setStore},
    [storeTypeTag]: "persist"
  }
};
