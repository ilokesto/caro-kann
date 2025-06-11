import type { SetStateAction, Store } from "../types";
export declare function createUseStore<T, S>({ getStore, setStore, subscribe }: Store<T>, selector: (state: T) => S): readonly [S, (nextState: SetStateAction<T>) => void];
