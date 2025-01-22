import { Dispatcher, MiddlewareStore, UseStore } from "./";
export type ReturnTypeCreate<T, A, Z extends "basic" | "reducer" | "zustand" = "basic"> = UseStore<T, A>[Z] & {
    derived: <S>(selector: (state: T) => S) => S;
};
export type Create = {
    <T, A>(initState: MiddlewareStore<T, "persist" | "devtools">): ReturnTypeCreate<T, A>;
    <T, A>(initState: MiddlewareStore<T, "reducer", Dispatcher<A>>): ReturnTypeCreate<T, A, "reducer">;
    <T>(initState: MiddlewareStore<T, "zustand">): ReturnTypeCreate<T, "zustand">;
    <T, A>(initState: T): ReturnTypeCreate<T, A>;
};
