import { ReactNode } from "react";
import { setBoard } from "./Types";
export declare const playTartakower: <T>(initialState: T) => {
    useBoard: {
        (): [T, setBoard<T>];
        <S>(selector: (state: T) => S): [S, setBoard<T>];
    };
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
