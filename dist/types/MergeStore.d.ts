import { SetStateAction } from "react";
import { store_property, Store } from "./Store";
type MergeableStore<T, A = SetStateAction<T>> = {
    [store_property]: Store<T, A>;
};
export type MergeableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export {};
