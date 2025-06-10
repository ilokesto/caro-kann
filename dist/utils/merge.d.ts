import { Store, store_props, context_props } from "../types";
import { Context, Dispatch, SetStateAction } from "react";
type MergeableStore<T> = {
    [store_props]: Store<T, SetStateAction<T>>;
    [context_props]: Context<Store<T, SetStateAction<T>>>;
};
type MergeProps<T extends Record<string, any>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
type GetStoreFrom<T extends Record<string, any>> = Partial<Record<keyof T, 'root' | 'context'>>;
export declare const merge: <T extends Record<string, any>, GST extends GetStoreFrom<T>>(props: MergeProps<T>, getStoreFrom?: GST) => {
    (): [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): [S, Dispatch<SetStateAction<T>>];
    readOnly: {
        (): T;
        <S>(selector?: (state: T) => S): S;
    };
    writeOnly(): Dispatch<SetStateAction<T>>;
};
export {};
