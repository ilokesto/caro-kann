import { PersistConfig, PersistUtils } from "../types";
export declare function getCookie(name: string): string | null;
export declare const execMigrate: PersistUtils["execMigration"];
export declare const getStorage: PersistUtils["getStorage"];
export declare const parseOptions: <T>(StorageConfig?: PersistConfig<T>) => {
    readonly storageKey: string;
    readonly storageType: "session" | "local" | "cookie" | null;
    readonly storageVersion: number;
    readonly migrate: {
        version: number;
        strategy: (prevState: any, prevVersion: number) => T;
    } | undefined;
};
export declare const setStorage: PersistUtils["setStorage"];
