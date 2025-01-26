import { useSyncExternalStore } from "react";
import { createStore } from "./createStore";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";
import { storeTypeTag } from "../types";
export const create = (initState) => {
    const store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const storeTag = isMiddlewareStore(initState) ? initState[storeTypeTag] : "basic";
    function useStore(selector) {
        const board = useSyncExternalStore(store.subscribe, () => selector ? selector(store.getStore()) : store.getStore(), () => selector ? selector(store.getInitState()) : store.getInitState());
        if (storeTag === "zustand")
            return board;
        if (selector && storeTag !== "reducer")
            return [board, setNestedStore(store.setStore, selector), store.setStore];
        else
            return [board, store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
