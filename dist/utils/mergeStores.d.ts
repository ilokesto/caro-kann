import { Dispatch, SetStateAction } from "react";
import { MergeableStores } from "../types/MergeStore";
export declare const merge: <T extends Record<string, unknown>>(stores: MergeableStores<T>) => {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
};
