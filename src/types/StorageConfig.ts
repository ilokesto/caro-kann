export type Migrate<T> = {
  version: number;
  strategy: (prevState: any, prevVersion: number) => T;
};

interface LocalStorageConfig<T> {
  local: string;
  session?: never;
  cookie?: never;
  migrate?: Migrate<T>;
}

interface SessionStorageConfig {
  local?: never;
  session: string;
  cookie?: never;
  migrate?: never;
}

interface CookieStorageConfig<T> {
  local?: never;
  session?: never;
  cookie: string;
  migrate?: Migrate<T>;
}

export type PersistConfig<T> =
  | LocalStorageConfig<T>
  | SessionStorageConfig
  | CookieStorageConfig<T>;

type Storage = Omit<keyof CookieStorageConfig<unknown>, "migrate"> | null;

export type GetStorage = <T>(props: {
  storageKey: string;
  storageType: Storage;
  migrate?: Migrate<T>;
  initState: T;
}) => { state: T; version: number };

export type SetStorage = <T>(props: {
  storageKey: string;
  storageVersion: number;
  value: T;
  storageType: Storage;
}) => void;

export type ExecMigrate = (
  props: Omit<Parameters<GetStorage>[0], "initState">
) => void;
