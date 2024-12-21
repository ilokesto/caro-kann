
type LocalStorageConfig<T> = {
  local: string;
  session?: never;
  migrate?: { version: number, strategy: (prevState: any, prevVersion: number) => T }
};

type SessionStorageConfig = {
  session: string;
  local?: never;
  migrate?: never;
};

type StorageConfig<T> = LocalStorageConfig<T> | SessionStorageConfig;

export type Options<T> =
  StorageConfig<T>
