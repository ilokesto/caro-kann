import { Dispatch, SetStateAction } from "react";
import { MiddlewareStore } from "./Middleware";
export interface Store<T, S = SetStateAction<T>> {
    setStore: Dispatch<S>;
    getStore: () => T;
    subscribe: (callback: () => void) => () => void;
    getInitState: () => T;
}
export type UseStore<T, TAction = unknown> = {
    basic: {
        (): readonly [T, Store<T>["setStore"]];
        <S>(selector: (state: T) => S): readonly [
            S,
            Store<S>["setStore"],
            Store<T>["setStore"]
        ];
        derived: <S>(selector: (state: T) => S) => S;
    };
    reducer: {
        (): readonly [T, Dispatch<TAction>];
        <S>(selector: (state: T) => S): readonly [S, Dispatch<TAction>];
        derived: <S>(selector: (state: T) => S) => S;
    };
    zustand: {
        (): T;
        <S>(selector: (state: T) => S): S;
        derived: <S>(selector: (state: T) => S) => S;
    };
};
export type Create = {
    <T, A>(initState: MiddlewareStore<T, "reducer", A>): UseStore<T, A>["reducer"];
    <T>(initState: MiddlewareStore<T, "zustand">): UseStore<T>["zustand"];
    <T>(initState: MiddlewareStore<T, "persist" | "devtools"> | T): UseStore<T>["basic"];
    <T>(initState: T): UseStore<T>["basic"];
};
