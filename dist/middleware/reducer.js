import { createStore } from "../core/createStore";
import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
export const reducer = (reducer, initState) => {
    const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const setStore = (action) => {
        Store.setStore(prev => reducer(prev, action), action.type);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "reducer"
    };
};
