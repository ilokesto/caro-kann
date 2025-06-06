import { jsx as _jsx } from "react/jsx-runtime";
import { storeTypeTag } from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    function useStore(selector, overrideStore) {
        const { getStore, setStore, getInitState, subscribe, getSelected } = useContext(ContextStore);
        const board = useSyncExternalStore(subscribe, overrideStore ? getSelected : () => selector ? selector(getStore()) : getStore(), overrideStore ? getSelected : () => selector ? selector(getInitState()) : getInitState());
        const overrideSetStore = (nextState) => {
            setStore(nextState, selector);
        };
        return [board, overrideStore ? overrideSetStore : setStore];
    }
    ;
    useStore.derived = (selector) => useStore(selector)[0];
    useStore.Provider = ({ store, children }) => {
        const { store: providerStore } = store;
        return _jsx(ContextStore.Provider, { value: providerStore, children: children });
    };
    return useStore;
};
