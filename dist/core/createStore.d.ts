import type { Store, SetStateAction } from "../types";
export declare class CreateStore<T> implements Store<T> {
    private store;
    private callbacks;
    constructor(initState: T);
    getStore: () => T;
    setStore: (nextState: SetStateAction<T>) => void;
    subscribe: (callback: () => void) => () => boolean;
}
