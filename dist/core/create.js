import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    const Store = createContext(initState instanceof Array ? initState[0] : createStore(initState));
    const useStore = useStoreSync({ Store, storeTag: initState instanceof Array ? initState[1] : undefined });
    const useDerivedStore = (selector) => {
        return useStore(selector)[0];
    };
    const StoreContext = ({ value, children }) => {
        return _jsx(Store.Provider, { value: createStore(value), children: children });
    };
    if (initState instanceof Array) {
        switch (initState[1]) {
            case "reducer":
                return { useStoreReducer: useStore };
            case "persist":
                return { useStore, useDerivedStore };
            case "zustand":
                return { useStore };
            default:
                return { useStore, useDerivedStore, StoreContext };
        }
    }
    return { useStore, useDerivedStore, StoreContext };
};
