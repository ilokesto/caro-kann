import { SetStateAction } from "react";
import type { Store } from "../types";
export declare const createStore: <T>(initState: T) => Store<T>;
export declare class CreateStore<T> implements Store<T> {
    private _callbacks;
    private _store;
    private _initStore;
    constructor(initStore: T);
    getInitState: () => T;
    getStore: () => T;
    setStore: (nextState: SetStateAction<T>) => void;
    subscribe: (callback: () => void) => () => boolean;
}
