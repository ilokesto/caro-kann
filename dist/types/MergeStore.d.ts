import { SetStateAction } from "react";
import { context, Store } from "./Store";
type MergeableStore<T, A = SetStateAction<T>> = {
    [context]: React.Context<Store<T, A>>;
};
export type MergeableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export {};
