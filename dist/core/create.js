import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    const useStore = useStoreSync({
        Store: initState[0] ?? createStore(initState),
        storeTag: initState[1],
    });
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
