import { Context } from "react";
import { Board, SetStore } from "../types";
export declare function useStore<T>(initialState: T, Board: Context<Board<T>>): readonly [T, SetStore<T>];
export declare function useStore<T, S>(initialState: T, Board: Context<Board<T>>, selector: (state: T) => S): readonly [S, SetStore<S>];
