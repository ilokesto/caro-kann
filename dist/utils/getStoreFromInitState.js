import { createStore } from "../core/createStore";
import { storeTypeTag } from "../types";
const isMiddlewareStore = (initState) => {
    return typeof initState === 'object' ? Reflect.has(initState, storeTypeTag) : false;
};
export const getStoreFromInitState = (initState) => isMiddlewareStore(initState)
    ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
    : { store: createStore(initState), [storeTypeTag]: [] };
export const createStoreFormProvider = (initState) => {
    return isMiddlewareStore(initState)
        ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
        : { store: createStore(initState), [storeTypeTag]: [] };
};
