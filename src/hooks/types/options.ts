
type LocalStorageConfig = {
  local: string;
  session?: never;
};

type SessionStorageConfig = {
  session: string;
  local?: never;
};

type StorageConfig = LocalStorageConfig | SessionStorageConfig;

export type Options = StorageConfig;