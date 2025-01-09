import { Context } from "react";
import { UseStore } from "./";
export type Dispatcher = (action: {
    [x: string]: any;
    type: string;
}) => void;
export type SetStore<T> = Store<T>["setStore"];
export type Store<T, S = (action: T | ((prev: T) => T)) => void> = {
    getStore: () => T;
    setStore: S;
    subscribe: (callback: () => void) => () => void;
    getInitState: () => T;
};
export type UseSyncStore = {
    <T>(props: {
        Store: Context<Store<T>>;
        storeTag: "reducer";
    }): UseStore<T>["reducer"];
    <T>(props: {
        Store: Context<Store<T>>;
        storeTag: "zustand";
    }): UseStore<T>["zustand"];
    <T>(props: {
        Store: Context<Store<T>>;
        storeTag?: string;
    }): UseStore<T>["basic"];
};
