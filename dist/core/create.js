import { useSyncExternalStore } from "react";
import { storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";
import { createStore } from "./createStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";
export const create = (initState) => {
    const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);
    const storeTag = isMiddlewareStore(initState) ? initState[storeTypeTag] : "basic";
    function useStore(selector = (state) => state) {
        const board = useSyncExternalStore(Store.subscribe, () => selector(Store.getStore()), () => selector(Store.getInitState()));
        if (storeTag === "zustand")
            return board;
        if (selector && storeTag !== "reducer")
            return [
                board,
                setNestedStore(Store.setStore, selector),
                Store.setStore,
            ];
        else
            return [board, Store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
