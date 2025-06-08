import { Store, store_props, context_props } from "../types";
import { Context } from "react";
type MergeableStore<T> = {
    [store_props]: Store<T, any>;
    [context_props]: Context<Store<T, any>>;
};
type MergeProps<T extends Record<string, any>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export declare const merge: <T extends Record<string, any>>(props: MergeProps<T>, getStoreForm?: "root") => {
    (): T;
    <S>(selector: (state: T) => S): S;
};
export {};
