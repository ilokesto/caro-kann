import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    const useStore = useStoreSync({
        Store: isMiddlewareStore(initState) ? initState.store : createStore(initState),
        storeTag: isMiddlewareStore(initState) ? initState[storeTypeTag] : undefined,
    });
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
