import { ReactNode } from "react";
import { Dispatcher, Roll, Store, UseStore } from "./";

export type ReturnTypeCreate<T, Z extends "basic" | "reducer" | "zustand" = "basic"> = {
  useStore: UseStore<T>[Z];
  useDerivedStore: <S>(selector: (state: T) => S) => S;
}

export type Create = {
  // middleware persist & devtools
  <T>(initState: [Store<T>, "persist" | "devtools"]): ReturnTypeCreate<T>;

  // middleware reducer
  <T>(initState: [Store<T, Dispatcher>, "reducer"]): ReturnTypeCreate<T, "reducer">;

  // middleware zustand
  <T>(initState: [Store<T>, "zustand"]): ReturnTypeCreate<T, "zustand">;

  // create
  <T>(initState: T): ReturnTypeCreate<T> & { StoreContext: (props: { value: T, children: ReactNode }) => ReactNode; };
};