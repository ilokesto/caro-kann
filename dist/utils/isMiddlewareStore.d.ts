import { MiddlewareStore } from "../types";
export declare const isMiddlewareStore: <T>(initState: T | MiddlewareStore<T, string>) => initState is MiddlewareStore<T, string>;
