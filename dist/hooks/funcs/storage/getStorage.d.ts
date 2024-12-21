import { Options } from "../../types";
export declare const getStorage: <T>(key: string, storageType: 'local' | 'session', defaultValue: T, migrate?: Options<T>["migrate"]) => {
    state: T;
    version: number;
};
