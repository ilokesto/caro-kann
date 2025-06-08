import { jsx as _jsx } from "react/jsx-runtime";
import { storeTypeTag } from "../types";
import { createContext, useContext, useSyncExternalStore } from "react";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const create = (initState) => {
    const { store } = getStoreFromInitState(initState);
    const ContextStore = createContext(store);
    function useStore(selector = (state) => state) {
        const { getStore, setStore, subscribe, getSelected, setSelected } = useContext(ContextStore);
        const s = selector(getStore());
        const isSelected = typeof s === 'object';
        if (isSelected)
            setSelected(s);
        const board = useSyncExternalStore(subscribe, isSelected ? getSelected : () => selector(getStore()), isSelected ? getSelected : () => selector(getStore('init')));
        return [
            board,
            isSelected
                ? (nextState) => {
                    setStore(nextState, "setStoreAction", selector);
                }
                : setStore
        ];
    }
    ;
    useStore.store = store;
    useStore.context = ContextStore;
    useStore.Provider = function ({ store, children }) {
        return _jsx(ContextStore.Provider, { value: store.store, children: children });
    };
    return useStore;
};
