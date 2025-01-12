import { Dispatcher, Store, UseStore } from "./";
export type ReturnTypeCreate<T, Z extends "basic" | "reducer" | "zustand" = "basic"> = UseStore<T>[Z] & {
    derived: <S>(selector: (state: T) => S) => S;
};
export type Create = {
    <T>(initState: [Store<T>, "persist" | "devtools"]): ReturnTypeCreate<T>;
    <T>(initState: [Store<T, Dispatcher>, "reducer"]): ReturnTypeCreate<T, "reducer">;
    <T>(initState: [Store<T>, "zustand"]): ReturnTypeCreate<T, "zustand">;
    <T>(initState: T): ReturnTypeCreate<T>;
};
