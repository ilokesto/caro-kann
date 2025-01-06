import type { Board, UseBoard } from "../types";
import { ReactNode } from "react";
export declare function playTartakower<T extends Board<R>, R>(initState: Board<R>): {
    useBoard: UseBoard<R>;
    useDerivedBoard: <S>(selector: (state: R) => S) => S;
};
export declare function playTartakower<T>(initState: T): {
    useBoard: UseBoard<T>;
    useDerivedBoard: <S>(selector: (state: T) => S) => S;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => JSX.Element;
};
