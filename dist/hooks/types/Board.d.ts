import { Context } from "react";
import { Options } from "./Options";
export interface Board<T> {
    getBoard: () => T;
    setBoard: SetBoard<T>;
    subscribe: (callback: () => void) => () => void;
    getInitState: () => T;
}
export type SetBoard<T> = (action: T | ((prev: T) => T)) => void;
export type CreateBoard = <T>(initValue: T, options?: Options<T>) => Board<T>;
export type UseBoard<T> = {
    (): readonly [T, SetBoard<T>];
    <S>(selector: (state: T) => S): readonly [S, SetBoard<S>, SetBoard<T>];
};
export type UseStore = {
    <T>(Board: Context<Board<T>>): readonly [T, SetBoard<T>];
    <T, S>(Board: Context<Board<T>>, selector: (value: T) => S): readonly [S, SetBoard<T>];
};
