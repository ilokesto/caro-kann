import { Options } from "../../types";
export declare const parseOptions: <T>(options?: Options<T>) => {
    readonly storageKey: string;
    readonly storageType: "session" | "local" | null;
    readonly storageVersion: number;
    readonly migrate: {
        version: number;
        strategy: (prevState: any, prevVersion: number) => T;
    } | undefined;
};
