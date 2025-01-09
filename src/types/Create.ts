import { ReactNode } from "react";
import { Dispatcher, SetStore, Store } from "./";

export type UseDerivedStore<T> = <S>(selector: (state: T) => S) => S;
export type StoreContext<T> = (props: { value: T, children: ReactNode }) => JSX.Element;
export type UseStore<T> = {
  basic: {
    (): readonly [T, SetStore<T>];
    <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
  },
  reducer: {
    (): readonly [T, Dispatcher];
    <S>(selector: (state: T) => S): readonly [S, Dispatcher];
  },
  zustand: {
    (): T;
    <S>(selector: (state: T) => S): S;
  },
}


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