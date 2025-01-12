import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
export const create = (initState) => {
    const Store = createContext(initState instanceof Array ? initState[0] : createStore(initState));
    const useStore = useStoreSync({ Store, storeTag: initState instanceof Array ? initState[1] : "basic" });
    const useDerivedStore = (selector) => useStore(selector)[0];
    const StoreContext = ({ value, children, }) => _jsx(Store.Provider, { value: createStore(value), children: children });
    return { useStore, useDerivedStore, StoreContext };
};
