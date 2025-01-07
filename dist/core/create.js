import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
function isStore(initState) {
    return initState.storeTag !== undefined;
}
export const create = (initState) => {
    const Store = createContext(isStore(initState) ? initState : createStore(initState));
    const useStore = useStoreSync(Store);
    const useDerivedStore = (selector) => {
        return useStore(selector)[0];
    };
    const StoreContext = ({ value, children }) => {
        return _jsx(Store.Provider, { value: createStore(value), children: children });
    };
    return isStore(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};
