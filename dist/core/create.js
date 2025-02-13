import { CreateStore } from "./createStore";
import { storeTypeTag } from "../types";
import { useSyncExternalStore } from "react";
export const create = (initState) => {
    const store = initState[storeTypeTag] ? initState.store : new CreateStore(initState);
    const storeTag = initState[storeTypeTag] ? initState[storeTypeTag] : "basic";
    function useStore(selector) {
        const board = useSyncExternalStore(store.subscribe, () => selector ? selector(store.getStore()) : store.getStore(), () => selector ? selector(store.getInitState()) : store.getInitState());
        if (storeTag === "zustand")
            return board;
        if (selector && storeTag !== "reducer") {
            const { setNestedStore } = require("../utils/setNestedStoreUtils");
            return [board, setNestedStore(store.setStore, selector), store.setStore];
        }
        else
            return [board, store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
