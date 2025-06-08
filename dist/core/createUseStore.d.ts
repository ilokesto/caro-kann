import { Dispatch, SetStateAction } from "react";
import { Store } from "../types";
export declare function createUseStore<T>(storeFn: () => Store<T>): {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
};
