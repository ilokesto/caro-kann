import { Dispatch, SetStateAction } from "react";
export declare const setImmer: <T>(setStore: Dispatch<SetStateAction<T>>) => (fn: (prev: T) => void | SetStateAction<T>) => void;
