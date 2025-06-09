import { Store, store_props, context_props } from "../types";
import { Context, Dispatch } from "react";
type MergeableStore<T, A> = {
    [store_props]: Store<T, A>;
    [context_props]: Context<Store<T, A>>;
};
type MergeProps<T extends Record<string, any>, A extends Record<keyof T, any>> = {
    [K in keyof T]: MergeableStore<T[K], A[K]>;
};
export declare const mergeReducer: <T extends Record<string, any>, A extends Record<keyof T, any>>(props: MergeProps<T, A>, getStoreFrom?: "root" | "context") => {
    (): [T, Dispatch<A>];
    <S>(selector: (state: T) => S): [S, Dispatch<A>];
};
export {};
