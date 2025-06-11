import type { Store } from "../types";
export declare function createUseStore<T, S>({ getStore, setStore, subscribe }: Store<T>, selector: (state: T) => S): readonly [S, (nextState: import("react").SetStateAction<T>, actionName?: string) => void];
