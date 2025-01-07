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
    return initState instanceof Array ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};
