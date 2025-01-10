import { createStore } from "../core/createStore";
import { Middleware } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";

export const persist: Middleware["persist"] = (initState, options) => {
  type T = typeof initState;
  const Store = createStore(initState);
  const optionObj = parseOptions(options);
  const initialState = optionObj.storageType
    ? getStorage({ ...optionObj, initState: Store.getInitState() }).state
    : Store.getInitState();
  Store.setStore(initialState);

  const setStore = (nextState: T | ((prev: T) => T)) => {
    Store.setStore(nextState);

    if (optionObj.storageType)
      setStorage({ ...optionObj, value: Store.getStore() });
  };

  return [{ ...Store, setStore }, "persist" as const];
};
