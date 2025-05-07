import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const debounce = (initState, wait = 300) => {
    const Store = getStoreFromInitState(initState);
    let timeout = null;
    let updates = [];
    const setStore = (nextState) => {
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
            Store.setStore(currentState);
            updates = [];
            timeout = null;
        }, wait);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "debounce"
    };
};
