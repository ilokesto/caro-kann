import type { Store, UseStore } from "../types";
import { ReactNode } from "react";
export declare function createStore<T>(initState: Store<T>): {
    useStore: UseStore<T>;
    useDerivedStore: <S>(selector: (state: T) => S) => S;
};
export declare function createStore<T>(initState: T): {
    useStore: UseStore<T>;
    useDerivedStore: <S>(selector: (state: T) => S) => S;
    BoardContext: ({ value, children }: {
        value: T;
        children: ReactNode;
    }) => JSX.Element;
};
