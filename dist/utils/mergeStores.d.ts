import { SetStateAction } from "react";
import { Store } from "../types";
type MergeableStore<T> = {
    store: Store<T, SetStateAction<T>>;
};
type MergeableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export declare const merge: <T extends Record<string, unknown>>(stores: MergeableStores<T>) => <S>(selector?: (state: T) => S) => readonly [any, (nextState: SetStateAction<T>, actionName?: string, selector?: ((state: T) => any) | undefined) => void];
export {};
