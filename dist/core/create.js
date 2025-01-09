import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    const Store = createContext(initState[0] ?? createStore(initState));
    const useStore = useStoreSync({ Store, storeTag: initState[1] });
    const useDerivedStore = (selector) => useStore(selector)[0];
    const StoreContext = ({ value, children, }) => _jsx(Store.Provider, { value: createStore(value), children: children });
    return { useStore, useDerivedStore, StoreContext };
};
