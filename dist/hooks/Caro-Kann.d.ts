import type { Options, UseBoard } from "./types";
import { ReactNode } from "react";
export declare function playTartakower<T>(initState: T, options?: Options): {
    useBoard: UseBoard<T>;
    useDerivedBoard: <S>(selector: (state: T) => S) => S;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
