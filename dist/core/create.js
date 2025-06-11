import { jsx as _jsx } from "react/jsx-runtime";
import { context_props, store_props } from "../types";
import { createContext, useContext } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./CreateUseStore";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    function useStore(selector = (state) => state) {
        const store = useContext(ContextStore);
        return createUseStore(store, selector);
    }
    useStore[context_props] = ContextStore;
    useStore[store_props] = store;
    const dummy = {};
    useStore.readOnly = (selector = (state) => state) => useStore(selector)[0];
    useStore.writeOnly = () => useStore(() => dummy)[1];
    useStore.Provider = function ({ store, children }) {
        return _jsx(ContextStore.Provider, { value: store.store, children: children });
    };
    return useStore;
};
