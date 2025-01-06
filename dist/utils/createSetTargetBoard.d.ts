import { SetStore } from "../types";
export declare const createSetTargetBoard: <T, S>(setBoard: SetStore<T>, selector: (value: T) => S) => (value: S | ((prev: S) => S)) => void;
