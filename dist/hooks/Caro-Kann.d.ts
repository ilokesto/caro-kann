import { ReactNode } from "react";
import type { SetStore, StorageConfig } from "./types";
export declare function playTartakower<T>(initialState: T, options?: StorageConfig): {
    useBoard: {
        (): readonly [T, SetStore<T>];
        <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
    };
    useDerivedBoard: <S_1>(selector: (state: T) => S_1) => S_1;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
