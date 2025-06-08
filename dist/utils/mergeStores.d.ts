import { Store } from "../types";
type MergeableStore<T> = {
    store: Store<T>;
};
type MergeableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export declare const merge: <T extends Record<string, unknown>>(stores: MergeableStores<T>) => {
    (): T;
    <S>(selector: (state: T) => S): S;
};
export {};
