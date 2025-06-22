import type { Store } from "../types";
export declare function createUseStore<T, S>(store: Store<T>, selector: (state: T) => S): readonly [S, (nextState: import("react").SetStateAction<T>, actionName?: string) => void];
