export type Dispatcher<A> = (action: A) => void;

export type Store<T, S = (action: T | ((prev: T) => T)) => void> = {
  setStore: S;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
};

export type UseStore<T, A> = {
  basic: {
    (): readonly [T, Store<T>["setStore"]];
    <S>(selector: (state: T) => S): readonly [
      S,
      Store<S>["setStore"],
      Store<T>["setStore"]
    ];
  };
  reducer: {
    (): readonly [T, Dispatcher<A>];
    <S>(selector: (state: T) => S): readonly [S, Dispatcher<A>];
  };
  zustand: {
    (): T;
    <S>(selector: (state: T) => S): S;
  };
};

export type UseSyncStore = {
  // middleware reducer
  <T, A>(props: { Store: Store<T>; storeTag: "reducer" }): UseStore<T, A>["reducer"];

  // middleware zustand
  <T, A>(props: { Store: Store<T>; storeTag: "zustand" }): UseStore<T, A>["zustand"];

  // create & middleware persist & devtools
  <T, A>(props: { Store: Store<T>; storeTag?: string }): UseStore<T, A>["basic"];
};

export type SetNestedBoard = <T, S>(
  setBoard: Store<T>["setStore"],
  selector: (value: T) => S
) => (value: S | ((prev: S) => S)) => void;
