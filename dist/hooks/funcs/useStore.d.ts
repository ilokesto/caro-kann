import { Context } from "react";
import { Board } from "../types";
export declare function useStore<T>(initialState: T, Board: Context<Board<T>>): readonly [T, Board<T>["setBoard"]];
export declare function useStore<T, S>(initialState: T, Board: Context<Board<T>>, selector: (state: T) => S): readonly [S, Board<T>["setBoard"]];
