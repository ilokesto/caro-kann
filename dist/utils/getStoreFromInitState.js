import { createStore } from "../core/createStore";
import { storeTypeTag } from "../types";
const isMiddlewareStore = (initState) => {
    return typeof initState === 'object' ? Reflect.has(initState, storeTypeTag) : false;
};
export const getStoreFromInitState = (initState) => isMiddlewareStore(initState) ? initState.store : createStore(initState);
