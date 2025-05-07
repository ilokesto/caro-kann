import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const validate = (initState, validator) => {
    const Store = getStoreFromInitState(initState);
    const validateScheme = getValidatorType(validator);
    const setStore = (nextState, actionName = "validate") => {
        const newState = typeof nextState === "function" ? nextState(Store.getStore()) : nextState;
        if (!validateScheme.validate(newState)) {
            console.error(`[Validation Error] Invalid state:`, validateScheme.formatError?.(newState));
            return;
        }
        Store.setStore(newState, actionName);
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "validate"
    };
};
function isZodSchema(validator) {
    return validator && typeof validator.parse === 'function' && typeof validator.safeParse === 'function';
}
function isYupSchema(validator) {
    return validator instanceof (require("yup").Schema);
}
function isSuperstructSchema(validator) {
    return validator instanceof (require("superstruct").Struct);
}
function getValidatorType(validator) {
    if (isZodSchema(validator)) {
        return zodValidator(validator);
    }
    else if (isYupSchema(validator)) {
        return yupValidator(validator);
    }
    else if (isSuperstructSchema(validator)) {
        return superstructValidator(validator);
    }
    else {
        throw new Error("Unsupported validation library");
    }
}
function zodValidator(schema) {
    return {
        validate: (state) => schema.safeParse(state).success,
        formatError: (state) => schema.safeParse(state).error?.format(),
    };
}
;
function yupValidator(schema) {
    return {
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
    };
}
function superstructValidator(schema) {
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
