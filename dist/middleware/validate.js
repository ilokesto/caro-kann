import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
import { getResolver } from "common-resolver/getResolver";
export const validate = (initState, validator) => {
    const Store = getStoreFromInitState(initState);
    const validateScheme = getResolver(validator);
    const setStore = (nextState, actionName = "validate") => {
        const newState = typeof nextState === "function" ? nextState(Store.getStore()) : nextState;
        const { valid, error } = validateScheme.validate(newState);
        if (!valid) {
            console.error(`[Validation Error] Invalid state:`, error);
            return;
        }
        Store.setStore(newState, actionName);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "validate"
    };
};
