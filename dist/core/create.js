import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createStore } from "./createStore";
import { useStoreSync } from "./useStoreSync";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
function isStore(initState) {
    return initState.getBoard !== undefined && initState.setBoard !== undefined;
}
export const create = (initState) => {
    const Store = createContext(isStore(initState) ? initState : createStore(initState));
    const useStore = (selector) => {
        const [board, setBoard] = selector ? useStoreSync(Store, selector) : useStoreSync(Store);
        if (selector)
            return [board, createSetTargetBoard(setBoard, selector), setBoard];
        else
            return [board, setBoard];
    };
    const useDerivedStore = (selector) => {
        return useStoreSync(Store, selector)[0];
    };
    const StoreContext = ({ value, children }) => {
        return _jsx(Store.Provider, { value: createStore(value), children: children });
    };
    return isStore(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, StoreContext };
};
