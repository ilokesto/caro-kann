import { createStore } from "../core/createStore";
import { storeTypeTag } from "../types";
const isMiddlewareStore = (initState) => initState !== null && typeof initState === 'object' ? Reflect.has(initState, storeTypeTag) : false;
export const getStoreFromInitState = (initState) => isMiddlewareStore(initState)
    ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
    : { store: createStore(initState), [storeTypeTag]: [] };
export const createStoreForProvider = (initState) => isMiddlewareStore(initState)
    ? { store: initState.store, [storeTypeTag]: initState[storeTypeTag] }
    : { store: createStore(initState), [storeTypeTag]: [] };
