export type Dispatcher<TAction> = (action: TAction) => void;

export type Store<T, S = (action: T | ((prev: T) => T)) => void> = {
  setStore: S;
  getStore: () => T;
  subscribe: (callback: () => void) => () => void;
  getInitState: () => T;
};

export type UseStore<T, TAction = unknown> = {
  basic: {
    (): readonly [T, Store<T>["setStore"]];
    <S>(selector: (state: T) => S): readonly [
      S,
      Store<S>["setStore"],
      Store<T>["setStore"]
    ];
    derived: <S>(selector: (state: T) => S) => S;
  };
  reducer: {
    (): readonly [T, Dispatcher<TAction>];
    <S>(selector: (state: T) => S): readonly [S, Dispatcher<TAction>];
    derived: <S>(selector: (state: T) => S) => S;
  };
  zustand: {
    (): T;
    <S>(selector: (state: T) => S): S;
    derived: <S>(selector: (state: T) => S) => S;
  };
};