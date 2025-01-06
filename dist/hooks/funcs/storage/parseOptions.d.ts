export declare const parseOptions: <T>(options?: any) => {
    readonly storageKey: any;
    readonly storageType: "session" | "local" | "cookie" | null;
    readonly storageVersion: any;
    readonly migrate: any;
};
