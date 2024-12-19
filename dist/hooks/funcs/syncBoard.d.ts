import { Context } from "react";
import type { Board, SetStore } from "../types";
export declare function useStore<T>(Board: Context<Board<T>>, initialState: T): readonly [T, SetStore<T>];
export declare function useStore<T, S>(Board: Context<Board<T>>, initialState: T, selector: (value: T) => S): readonly [S, SetStore<T>];
