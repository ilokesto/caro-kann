import { Middleware, MiddlewareStore, storeTypeTag, ValidateSchema, Validator } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const validate: Middleware["validate"] = <T>(initState: T | MiddlewareStore<T>, validator: ValidateSchema<T>[keyof ValidateSchema<T>]) => {
  const Store = getStoreFromInitState(initState);
  const validateScheme = getValidatorType(validator);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "validate") => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    if (!validateScheme.validate(newState)) {
      console.error(`[Validation Error] Invalid state:`, validateScheme.formatError?.(newState));
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

function getValidatorType<T>(validator: ValidateSchema<T>[keyof ValidateSchema<T>]) {
  switch (true) {
    case validator instanceof (require("zod").ZodSchema):
      return zodValidator(validator as import("zod").ZodSchema<T>);
    case validator instanceof (require("yup").Schema):
      return yupValidator(validator as import("yup").Schema<T>);
    case validator instanceof (require("superstruct").Struct):
      return superstructValidator(validator as import("superstruct").Struct<T, any>);
    default:
      throw new Error("Unsupported validation library");  
  }
}


// zod 스키마 래퍼
function zodValidator<T>(schema: ValidateSchema<T>["zod"]): Validator<T> {
  return {
    validate: (state) => schema.safeParse(state).success,
    formatError: (state) => schema.safeParse(state).error?.format(),
  };
};

// yup 스키마 래퍼
function yupValidator<T>(schema: ValidateSchema<T>["yup"]): Validator<T> {
  return {
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
  };
}

// superstruct 스키마 래퍼
function superstructValidator<T>(schema: ValidateSchema<T>["superstruct"]): Validator<T> {
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