type Migrate<T> = {
    version: number;
    strategy: (prevState: any, prevVersion: number) => T;
};
type StorageConfig<T = unknown> = {
    local: {
        local: string;
        session?: never;
        cookie?: never;
        migrate?: Migrate<T>;
    };
    session: {
        local?: never;
        session: string;
        cookie?: never;
        migrate?: never;
    };
    cookie: {
        local?: never;
        session?: never;
        cookie: string;
        migrate?: Migrate<T>;
    };
};
export type PersistConfig<T> = StorageConfig<T>[keyof StorageConfig];
export type PersistUtils = {
    common: {
        storageKey: string;
        storageType: keyof StorageConfig | null;
    };
    getStorage: <T>(props: PersistUtils["common"] & {
        migrate?: Migrate<T>;
        initState: T;
    }) => {
        state: T;
        version: number;
    };
    setStorage: <T>(props: PersistUtils["common"] & {
        storageVersion: number;
        value: T;
    }) => void;
    execMigration: <T>(props: PersistUtils["common"] & {
        migrate?: Migrate<T>;
    }) => void;
};
export {};
