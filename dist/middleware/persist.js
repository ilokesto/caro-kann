import { createStore } from "../core/createStore";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";
export const persist = (initState, options) => {
    const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const optionObj = parseOptions(options);
    const initialState = optionObj.storageType
        ? getStorage({ ...optionObj, initState: Store.getInitState() }).state
        : Store.getInitState();
    Store.setStore(initialState);
    const setStore = (nextState, actionName = "setStore") => {
        Store.setStore(nextState, actionName);
        if (optionObj.storageType)
            setStorage({ ...optionObj, value: Store.getStore() });
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "persist"
    };
};
