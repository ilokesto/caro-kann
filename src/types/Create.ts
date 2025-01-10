import { ReactNode } from "react";
import { Dispatcher, Roll, Store, UseStore } from "./";

type OmitStoreContext<T> = Roll<Omit<T, "StoreContext">>;

export type ReturnTypeCreate<T, Z extends "basic" | "reducer" | "zustand" = "basic"> = {
  useStore: UseStore<T>[Z];
  useDerivedStore: <S>(selector: (state: T) => S) => S;
  StoreContext: (props: { value: T, children: ReactNode }) => ReactNode;
}

export type Create = {
  // middleware persist & devtools
  <T>(initState: [Store<T>, "persist" | "devtools"]): OmitStoreContext<ReturnTypeCreate<T>> 

  // middleware reducer
  <T>(initState: [Store<T, Dispatcher>, "reducer"]): OmitStoreContext<ReturnTypeCreate<T, "reducer">> 

  // middleware zustand
  <T>(initState: [Store<T>, "zustand"]): OmitStoreContext<ReturnTypeCreate<T, "zustand">> 

  // create
  <T>(initState: T): ReturnTypeCreate<T>;
};