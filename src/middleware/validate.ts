import { Middleware, MiddlewareStore, storeTypeTag, Validator } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

const zodValidator = <T>(schema: import("zod").ZodSchema<T>): Validator<T> => ({
  validate: (state) => schema.safeParse(state).success,
  formatError: (state) => schema.safeParse(state).error?.format(),
});

// yup 스키마 래퍼
const yupValidator = <T>(schema: import("yup").Schema<T>): Validator<T> => ({
  validate: (state) => {
    try {
      schema.validateSync(state);
      return true;
    } catch {
      return false;
    }
  },
  formatError: (state) => {
    try {
      schema.validateSync(state);
    } catch (e) {
      return e;
    }
  }
});

export function superstructValidator<T>(schema: import("superstruct").Struct<T, any>) {
  const { validate: ssValidate } = require("superstruct"); // 안전하게 require

  return {
    validate(state: T): boolean {
      const [error] = ssValidate(state, schema);
      return error == null;
    },
    formatError(state: T) {
      const [error] = ssValidate(state, schema);
      return error ?? null;
    }
  };
}

export const validate: Middleware["validate"] = <T>(initState: T | MiddlewareStore<T>, validator: Validator<T>) => {
  const Store = getStoreFromInitState(initState);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "validate") => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    if (!validator.validate(newState)) {
      console.error(`[Validation Error] Invalid state:`, validator.formatError?.(newState));
      return;
    }

    // @ts-ignore
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

