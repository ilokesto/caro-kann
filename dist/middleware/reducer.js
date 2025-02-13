import { createStore } from "../core/createStore";
import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
export const reducer = (reducer, initState) => {
    const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const reducerProxy = new Proxy(Store, reducerProxyHandler(reducer));
    return {
        store: reducerProxy,
        [storeTypeTag]: "reducer"
    };
};
const reducerProxyHandler = (reducer) => ({
    get: (target, prop) => {
        if (prop === "setStore") {
            const setStore = (action) => {
                Store.setStore(prev => reducer(prev, action), action.type);
            };
            return setStore;
        }
        return Reflect.get(target, prop);
    },
});
