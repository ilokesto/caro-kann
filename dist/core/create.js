import { createStore } from "./createStore";
import { storeTypeTag } from "../types";
import { useSyncExternalStore } from "react";
export const create = (initState) => {
    const store = initState[storeTypeTag] ? initState.store : createStore(initState);
    const storeTag = initState[storeTypeTag] ? initState[storeTypeTag] : "basic";
    const cashedObj = {};
    function useStore(selector) {
        const getSnapshot = () => {
            if (selector) {
                const res = selector(store.getStore());
                if (res && typeof res === "object" && !Array.isArray(res)) {
                    Object.assign(cashedObj, res);
                    return cashedObj;
                }
                return res;
            }
            else {
                return store.getStore();
            }
        };
        const board = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
        if (storeTag === "zustand")
            return board;
        else
            return [board, store.setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    return useStore;
};
