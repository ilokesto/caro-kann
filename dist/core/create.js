import { jsx as _jsx } from "react/jsx-runtime";
import { storeTypeTag } from "../types";
import { createContext, useContext } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./createUseStore";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    const useStore = createUseStore(() => useContext(ContextStore));
    useStore.store = store;
    useStore.Provider = function ({ store, children }) {
        return _jsx(ContextStore.Provider, { value: store.store, children: children });
    };
    return useStore;
};
