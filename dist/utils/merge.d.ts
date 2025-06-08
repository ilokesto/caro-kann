import { UseStore } from "../types";
type MergeProps<T extends Record<string, any>> = {
    [K in keyof T]: UseStore<T[K]>;
};
export declare const merge: <T extends Record<string, any>>(props: MergeProps<T>, getStoreForm?: "root") => {
    (): T;
    <S>(selector: (state: T) => S): S;
};
export {};
