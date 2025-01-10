import { Dispatcher, Store, StoreContext, UseDerivedStore, UseStore } from "./";
export type Create = {
    <T>(initState: [Store<T>, "persist" | "devtools"]): {
        useStore: UseStore<T>["basic"];
        useDerivedStore: UseDerivedStore<T>;
    };
    <T>(initState: [Store<T, Dispatcher>, "reducer"]): {
        useStore: UseStore<T>["reducer"];
        useDerivedStore: UseDerivedStore<T>;
    };
    <T>(initState: [Store<T>, "zustand"]): {
        useStore: UseStore<T>["zustand"];
        useDerivedStore: UseDerivedStore<T>;
    };
    <T>(initState: T): {
        useStore: UseStore<T>["basic"];
        useDerivedStore: UseDerivedStore<T>;
        StoreContext: StoreContext<T>;
    };
};
