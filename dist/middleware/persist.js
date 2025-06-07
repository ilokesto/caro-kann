import { storeTypeTag } from "../types";
import { getStorage, parseOptions, setStorage } from "../utils/persistUtils";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const persist = (initState, options) => {
    const { store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
    const optionObj = parseOptions(options);
    const initialState = optionObj.storageType
        ? getStorage({ ...optionObj, initState: Store.getStore('init') }).state
        : Store.getStore('init');
    Store.setStore(initialState);
    const setStore = (nextState, actionName, selector) => {
        Store.setStore(nextState, actionName, selector);
        if (optionObj.storageType)
            setStorage({ ...optionObj, value: Store.getStore() });
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: ["persist", ...storeTypeTagArray]
    };
};
