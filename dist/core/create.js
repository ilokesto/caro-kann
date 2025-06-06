import { jsx as _jsx } from "react/jsx-runtime";
import { storeTypeTag } from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    function useStore(selector) {
        const { getStore, setStore, getInitState, subscribe } = useContext(ContextStore);
        const board = useSyncExternalStore(subscribe, () => selector ? selector(getStore()) : getStore(), () => selector ? selector(getInitState()) : getInitState());
        return [board, setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    useStore.Provider = ({ store, children }) => {
        const { store: providerStore } = store;
        return _jsx(ContextStore.Provider, { value: providerStore, children: children });
    };
    return useStore;
};
