export declare const playTartakower: <T>(initialState: T) => <S>(selector?: (state: T) => S) => readonly [S, (action: T | ((prev: T) => T)) => void];
