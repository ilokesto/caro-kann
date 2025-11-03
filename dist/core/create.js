import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { context_props, store_props } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { createUseStore } from "./CreateUseStore";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    const useStore = Object.assign((selector = (state) => state) => {
        const store = useContext(ContextStore);
        return createUseStore(store, selector);
    }, {
        [context_props]: ContextStore,
        [store_props]: store,
        writeOnly: () => useContext(ContextStore).setStore,
        readOnly: (selector = (state) => state) => useStore(selector)[0],
        Provider: ({ store, children }) => _jsx(ContextStore.Provider, { value: store.store, children: children })
    });
    return useStore;
};
