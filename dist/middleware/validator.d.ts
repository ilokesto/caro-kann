import { Middleware } from "../types";
export declare function superstructValidator<T>(schema: import("superstruct").Struct<T, any>): {
    validate(state: T): boolean;
    formatError(state: T): any;
};
export declare const validate: Middleware["validate"];
