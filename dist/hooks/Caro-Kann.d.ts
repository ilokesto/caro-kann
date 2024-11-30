import { ReactNode } from "react";
import { UseBoard } from "./types/Types";
export declare const playTartakower: <T>(initialState: T) => {
    useBoard: UseBoard<T>;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
