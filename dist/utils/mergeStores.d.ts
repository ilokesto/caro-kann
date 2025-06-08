import { Dispatch, SetStateAction } from "react";
import { Store } from "../types";
type MergeableStore<T, A = SetStateAction<T>> = {
    context: React.Context<Store<T, A>>;
};
type MergeableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: MergeableStore<T[K]>;
};
export declare const merge: <T extends Record<string, unknown>>(stores: MergeableStores<T>) => {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
};
export {};
