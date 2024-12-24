export type Migrate<T> = { version: number, strategy: (prevState: any, prevVersion: number) => T }

type LocalStorageConfig<T> = {
  local: string;
  session?: never;
  cookie?: never;
  migrate?: Migrate<T>;
}

type SessionStorageConfig = {
  local?: never;
  session: string;
  cookie?: never;
  migrate?: never;
};

type CookieStorageConfig<T> = {
  local?: never;
  session?: never;
  cookie: string;
  migrate?: Migrate<T>;
}

type StorageConfig<T> = LocalStorageConfig<T> | SessionStorageConfig | CookieStorageConfig<T>;

export type Options<T> = StorageConfig<T>;