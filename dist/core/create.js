import { useSyncExternalStore } from "react";
import { createStore } from "./createStore";
import { setNestedStore } from "../utils/setNestedStoreUtils";
import { storeTypeTag } from "../types";
export const create = (initState) => {
    const store = initState[storeTypeTag] ? initState.store : createStore(initState);
    const storeTag = initState[storeTypeTag] ? initState[storeTypeTag] : "basic";
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
