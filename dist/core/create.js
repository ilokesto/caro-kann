import { storeTypeTag } from "../types";
import { useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const create = (initState) => {
    const { store, [storeTypeTag]: storeTag } = getStoreFromInitState(initState);
    function useStore(selector) {
        const board = useSyncExternalStore(store.subscribe, () => selector ? selector(store.getStore()) : store.getStore(), () => selector ? selector(store.getInitState()) : store.getInitState());
        return [board, store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
