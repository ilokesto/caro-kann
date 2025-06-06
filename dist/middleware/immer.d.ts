declare function immer<T>(recipe: (draft: T) => void): (baseState: T) => T;
