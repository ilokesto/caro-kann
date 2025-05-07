import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
const zodValidator = (schema) => ({
    validate: (state) => schema.safeParse(state).success,
    formatError: (state) => schema.safeParse(state).error?.format(),
});
const yupValidator = (schema) => ({
    validate: (state) => {
        try {
            schema.validateSync(state);
            return true;
        }
        catch {
            return false;
        }
    },
    formatError: (state) => {
        try {
            schema.validateSync(state);
        }
        catch (e) {
            return e;
        }
    }
});
export function superstructValidator(schema) {
    const { validate: ssValidate } = require("superstruct");
    return {
        validate(state) {
            const [error] = ssValidate(state, schema);
            return error == null;
        },
        formatError(state) {
            const [error] = ssValidate(state, schema);
            return error ?? null;
        }
    };
}
export const validate = (initState, validator) => {
    const Store = getStoreFromInitState(initState);
    const setStore = (nextState, actionName = "validate") => {
        const newState = typeof nextState === "function" ? nextState(Store.getStore()) : nextState;
        if (!validator.validate(newState)) {
            console.error(`[Validation Error] Invalid state:`, validator.formatError?.(newState));
            return;
        }
        Store.setStore(newState, actionName);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "validate"
    };
};
validate.zod = zodValidator;
validate.yup = yupValidator;
validate.superstruct = superstructValidator;
