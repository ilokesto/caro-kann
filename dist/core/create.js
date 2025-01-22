import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    return isMiddlewareStore(initState)
        ? useStoreSync({ Store: initState.store, storeTag: initState[storeTypeTag] })
        : useStoreSync({ Store: createStore(initState) });
};
