import { storeTypeTag } from "../types";
import { createStore } from "../core/createStore";
const isMiddlewareStore = (initState) => typeof initState === 'object' ? Reflect.has(initState, storeTypeTag) : false;
export const getStoreFromInitState = (initState) => isMiddlewareStore(initState)
    ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
    : { store: createStore(initState), [storeTypeTag]: [] };
export const createStoreForProvider = (initState) => isMiddlewareStore(initState)
    ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
    : { store: createStore(initState), [storeTypeTag]: [] };
