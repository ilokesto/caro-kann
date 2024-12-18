import { ReactNode } from "react";
import { UseBoard } from "./types";
export declare function playTartakower<T>(initialState: T): {
    useBoard: UseBoard<T>;
    useDerivedBoard: <S>(selector: (state: T) => S) => S;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
