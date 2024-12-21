import { Options } from "./Options";

export type GetStorage = <T>(props: {storageKey: string, storageType: 'local' | 'session' | null, migrate: Options<T>["migrate"], initState: T}) => { state: T, version: number };
export type SetStorage = <T>(props: {storageKey: string, storageVersion: number, value: T, storageType: 'local' | 'session' | null}) => void;