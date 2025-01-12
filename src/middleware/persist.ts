import { createStore } from "../core/createStore";
import { Middleware, PersistConfig, Store } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";

export const persist: Middleware["persist"] = <T,>(initState: T | [Store<T>, string], options: PersistConfig<T>) => {
  const Store = initState instanceof Array ? initState[0] : createStore(initState);
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

  return [{ ...Store, setStore } as Store<T>, "persist" as const];
};
