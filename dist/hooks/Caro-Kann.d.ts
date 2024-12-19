import { ReactNode } from "react";
import { SetStore } from "./types";
export declare function playTartakower<T>(initialState: T): {
    useBoard: {
        (): readonly [T, SetStore<T>];
        <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
    };
    useDerivedBoard: <S_1>(selector: (state: T) => S_1) => T | S_1;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
