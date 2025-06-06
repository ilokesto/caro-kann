import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const debounce = (initState, wait = 300) => {
    const { store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
    let timeout = null;
    let updates = [];
    const setStore = (nextState, actionName, selector) => {
        updates.push(nextState);
        if (timeout)
            return;
        timeout = setTimeout(() => {
            let currentState = Store.getStore();
            updates.forEach(update => {
                if (typeof update === 'function') {
                    currentState = update(currentState);
                }
                else {
                    currentState = update;
                }
            });
            Store.setStore(currentState, actionName, selector);
            updates = [];
            timeout = null;
        }, wait);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: ["debounce", ...storeTypeTagArray]
    };
};
