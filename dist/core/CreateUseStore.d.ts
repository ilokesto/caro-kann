import type { SetStateAction, Store } from "../types";
export declare function createUseStore<T, S>(store: Store<T>, selector: (state: T) => S): readonly [any, (nextState: SetStateAction<T>) => void];
