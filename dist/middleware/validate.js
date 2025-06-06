import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const validate = (initState, resolver) => {
    const { store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
    const setStore = (nextState, actionName = "validate", selector) => {
        const newState = typeof nextState === "function" ? nextState(Store.getStore()) : nextState;
        const { valid, error } = resolver.validate(newState);
        if (!valid) {
            console.error(`[Validation Error] Invalid state:`, error);
            return;
        }
        Store.setStore(newState, actionName, selector);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: ["validate", ...storeTypeTagArray]
    };
};
