import { createStore } from "../core/createStore";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { Middleware, MiddlewareStore, PersistConfig, Store, storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";

export const persist: Middleware["persist"] = <T,>(initState: T | MiddlewareStore<T>, options: PersistConfig<T>) => {
  const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
  const optionObj = parseOptions(options);
  const persistProxy = new Proxy(Store, persistProxyHandler(optionObj))

  const initialState = getStorage({ ...optionObj, initState: persistProxy.getInitState() }).state;

  Reflect.apply(persistProxy.setStore, persistProxy, [initialState]);

  return {
    store: persistProxy,
    [storeTypeTag]: "persist"
  }
};

const persistProxyHandler = <T>(optionObj: ReturnType<typeof parseOptions>): ProxyHandler<Store<T>> => ({
  get: (target, prop) => {
    if (prop === "setStore") {
      const setStore = (nextState: T | ((prev: T) => T), actionName: string = "setStore") => {
        // @ts-ignore
        target.setStore(nextState, actionName);

        if (optionObj.storageType) setStorage({ ...optionObj, value: target.getStore() });
      };

      return setStore;
    }
    return Reflect.get(target, prop);
  },
})