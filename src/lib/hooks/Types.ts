export interface Board<T> {
  getBoard: () => T;
  setBoard: (action: T | ((prev: T) => T)) => void;
  subscribe: (callback: () => void) => () => void;
}

export type setBoard<T> = Pick<Board<T>, "setBoard">["setBoard"];

export type CreateBoard = <T>(initValue: T) => Board<T>;
