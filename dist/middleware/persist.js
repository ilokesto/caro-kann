import { createStore } from "../core/createStore";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";
export const persist = (initState, options) => {
    const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const optionObj = parseOptions(options);
    const persistProxy = new Proxy(Store, persistProxyHandler(optionObj));
    const initialState = getStorage({ ...optionObj, initState: persistProxy.getInitState() }).state;
    Reflect.apply(persistProxy.setStore, persistProxy, [initialState]);
    return {
        store: persistProxy,
        [storeTypeTag]: "persist"
    };
};
const persistProxyHandler = (optionObj) => ({
    get: (target, prop) => {
        if (prop === "setStore") {
            const setStore = (nextState, actionName = "setStore") => {
                target.setStore(nextState, actionName);
                if (optionObj.storageType)
                    setStorage({ ...optionObj, value: target.getStore() });
            };
            return setStore;
        }
        return Reflect.get(target, prop);
    },
});
