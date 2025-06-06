import { jsx as _jsx } from "react/jsx-runtime";
import { storeTypeTag } from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    function useStore(selector = (state) => state) {
        const { getStore, setStore, getInitState, subscribe, getSelected, setSelected } = useContext(ContextStore);
        const a = selector(getStore());
        if (typeof a === 'object')
            setSelected(selector(getStore()));
        const board = useSyncExternalStore(subscribe, typeof a === 'object' ? getSelected : () => selector(getStore()), typeof a === 'object' ? getSelected : () => selector(getInitState()));
        const overrideSetStore = (nextState) => {
            setStore(nextState, "setStoreAction", selector);
        };
        return [board, typeof a === 'object' ? overrideSetStore : setStore];
    }
    ;
    useStore.Provider = function ({ store, children }) {
        const { store: providerStore } = store;
        return _jsx(ContextStore.Provider, { value: providerStore, children: children });
    };
    return useStore;
};
