import { Dispatcher, Store, StoreContext, UseDerivedStore, UseStore } from "./";

export type Create = {
  // middleware persist & devtools
  <T>(initState: [Store<T>, "persist" | "devtools"]): {
    useStore: UseStore<T>["basic"];
    useDerivedStore: UseDerivedStore<T>;
  };

  // middleware reducer
  <T>(initState: [Store<T, Dispatcher>, "reducer"]): {
    useStore: UseStore<T>["reducer"];
    useDerivedStore: UseDerivedStore<T>;
  };

  // middleware zustand
  <T>(initState: [Store<T>, "zustand"]): {
    useStore: UseStore<T>["zustand"];
    useDerivedStore: UseDerivedStore<T>;
  };

  // create
  <T>(initState: T): {
    useStore: UseStore<T>["basic"];
    useDerivedStore: UseDerivedStore<T>;
    StoreContext: StoreContext<T>;
  };
};