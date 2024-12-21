import { ReactNode } from "react";
import type { StorageConfig, UseBoard } from "./types";
export declare function playTartakower<T>(initialState: T, options?: StorageConfig): {
    useBoard: UseBoard<T>;
    useDerivedBoard: <S>(selector: (state: T) => S) => S;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
