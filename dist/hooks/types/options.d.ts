type LocalStorageConfig = {
    local: string;
    session?: never;
};
type SessionStorageConfig = {
    session: string;
    local?: never;
};
type StorageConfig = LocalStorageConfig | SessionStorageConfig;
export type Options<T> = StorageConfig & {
    migrate?: {
        version: number;
        strategy: (prevState: any, prevVersion: number) => T;
    };
};
export {};
