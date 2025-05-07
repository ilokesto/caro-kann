import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const reducer = (reducer, initState) => {
    const Store = getStoreFromInitState(initState);
    const setStore = (action) => {
        Store.setStore(prev => reducer(prev, action), action.type);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "reducer"
    };
};
