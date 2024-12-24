import { SetBoard } from "../types";
export declare const createSetTargetBoard: <T, S>(setBoard: SetBoard<T>, selector: (value: T) => S) => (value: S | ((prev: S) => S)) => void;
