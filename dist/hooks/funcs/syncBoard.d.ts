import { Context } from "react";
import type { Board } from "../types";
export declare const useStore: <T, S>(Board: Context<Board<T>>, initialState: T, selector?: (value: T) => S) => readonly [T | S, import("../types").SetStore<T>];
