import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const reducer = (reducer, initState) => {
    const { store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
    const setStore = (action, actionName) => {
        Store.setStore(prev => reducer(prev, action), action.type);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: ["reducer", ...storeTypeTagArray]
    };
};
