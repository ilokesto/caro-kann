export interface Board<T> {
  getBoard: () => T;
  setBoard: SetStore<T>;
  subscribe: (callback: () => void) => () => void;
}

export type SetStore<T> = (action: T | ((prev: T) => T)) => void

export type CreateBoard = <T>(initValue: T, options?: StorageConfig) => Board<T>;

type LocalStorageConfig = {
  local: string;
  session?: never;
};

type SessionStorageConfig = {
  session: string;
  local?: never;
};

export type StorageConfig = LocalStorageConfig | SessionStorageConfig;