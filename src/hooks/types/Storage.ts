import { Options } from "./Options";

export type GetStorage = <T>(props: {storageKey: string, storageType: 'local' | 'cookie' | null, migrate: Options<T>["migrate"], initState: T}) => { state: T, version: number };
export type SetStorage = <T>(props: {storageKey: string, storageVersion: number, value: T, storageType: 'local' | 'cookie' | null}) => void;

export type ExecMigrate = (props: Omit<Parameters<GetStorage>[0], "initState"> ) => void