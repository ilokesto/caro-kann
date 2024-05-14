import { setBoard } from "./Types";
export declare const playTartakower: <T>(initialState: T) => {
    (): [T, setBoard<T>];
    <S>(selector: (state: T) => S): [S, setBoard<T>];
};
