import { Options } from "../../types";
export declare const parseOptions: <T>(options?: Options<T>) => {
    readonly storageKey: string;
    readonly storageType: "session" | "local" | "cookie" | null;
    readonly storageVersion: number;
    readonly migrate: import("../../types").Migrate<T> | undefined;
};
