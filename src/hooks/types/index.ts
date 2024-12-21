import type { Context } from "react";

export interface Board<T> {
  getBoard: () => T;
  setBoard: SetStore<T>;
  subscribe: (callback: () => void) => () => void;
}

export type SetStore<T> = (action: T | ((prev: T) => T)) => void

export type CreateBoard = <T>(initValue: T, options?: StorageConfig) => Board<T>;

export type UseBoard<T> = {
    (): readonly [T, SetStore<T>];
    <S>(selector: (state: T) => S): readonly [S, SetStore<S>, SetStore<T>];
}

export type UseStore = {
  <T>(Board: Context<Board<T>>, initialState: T): readonly [T, SetStore<T>];
  <T, S>(Board: Context<Board<T>>, initialState: T, selector: (value: T) => S): readonly [S, SetStore<T>];
}

type LocalStorageConfig = {
  local: string;
  session?: never;
};

type SessionStorageConfig = {
  session: string;
  local?: never;
};

export type StorageConfig = LocalStorageConfig | SessionStorageConfig;