import type { Store } from "../types";
type SetNestedBoard = <T, S>(setBoard: Store<T>["setStore"], selector: (value: T) => S) => (value: S | ((prev: S) => S)) => void;
export declare const setNestedStore: SetNestedBoard;
export {};
