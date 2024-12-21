type LocalStorageConfig = {
  local: string;
  cookie?: never;
};

type SessionStorageConfig = {
  cookie: string;
  local?: never;
};

type StorageConfig = LocalStorageConfig | SessionStorageConfig;

export type Options<T> = StorageConfig & { migrate?: { version: number, strategy: (prevState: any, prevVersion: number) => T }}