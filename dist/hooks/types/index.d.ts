export interface Board<T> {
    getBoard: () => T;
    setBoard: SetStore<T>;
    subscribe: (callback: () => void) => () => void;
}
export type SetStore<T> = (action: T | ((prev: T) => T)) => void;
export type CreateBoard = <T>(initValue: T) => Board<T>;
