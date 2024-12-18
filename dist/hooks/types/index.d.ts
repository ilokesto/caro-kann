import { Context } from "react";
export interface Board<T> {
    getBoard: () => T;
    setBoard: (action: T | ((prev: T) => T)) => void;
    subscribe: (callback: () => void) => () => void;
}
export type SetStore<T> = Pick<Board<T>, "setBoard">["setBoard"];
export type CreateBoard = <T>(initValue: T) => Board<T>;
export type UseBoard<T> = {
    (): readonly [T, SetStore<T>];
    <S>(selector: (state: T) => S): readonly [S, SetStore<S>];
};
export type UseStore = {
    <T>(initialState: T, Board: Context<Board<T>>): readonly [T, SetStore<T>];
    <T, S>(initialState: T, Board: Context<Board<T>>, selector: (board: T) => S): readonly [S, SetStore<S>];
};
