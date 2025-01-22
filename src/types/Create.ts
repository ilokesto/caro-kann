import { Dispatcher, MiddlewareStore, UseStore } from "./";

export type ReturnTypeCreate<
  TInitState,
  TStoreType extends "basic" | "reducer" | "zustand" = "basic",
  TAction = unknown,
> = UseStore<TInitState, TAction>[TStoreType];

export type Create = {
  // middleware reducer
  <T, A>(initState: MiddlewareStore<T, "reducer", Dispatcher<A>>): ReturnTypeCreate<T, "reducer", A>;

  // middleware zustand
  <T>(initState: MiddlewareStore<T, "zustand">): ReturnTypeCreate<T, "zustand">;
  
  // middleware persist & devtools
  <T>(initState: MiddlewareStore<T, "persist" | "devtools"> | T): ReturnTypeCreate<T>;

  // create
  <T>(initState: T): ReturnTypeCreate<T>;
};
