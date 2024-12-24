import { Migrate } from "./";

type Storage = "local" | "session" | "cookie"  | null ;

export type GetStorage = <T>(props: {storageKey: string, storageType: Storage, migrate?: Migrate<T>, initState: T}) => { state: T, version: number };
export type SetStorage = <T>(props: {storageKey: string, storageVersion: number, value: T, storageType: Storage}) => void;

export type ExecMigrate = (props: Omit<Parameters<GetStorage>[0], "initState"> ) => void