import { useSyncExternalStore } from "react";
import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";
export const create = (initState) => {
    const store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const storeTag = isMiddlewareStore(initState) ? initState[storeTypeTag] : "basic";
    function useStore(selector = (state) => state) {
        const board = useSyncExternalStore(store.subscribe, () => selector(store.getStore()), () => selector(store.getInitState()));
        if (storeTag === "zustand")
            return board;
        if (selector && storeTag !== "reducer")
            return [
                board,
                setNestedStore(store.setStore, selector),
                store.setStore,
            ];
        else
            return [board, store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
