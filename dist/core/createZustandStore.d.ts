export declare function createZustandBoard<T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T) => T): {
    getStore: () => T;
    setStore: (nextState: Partial<T> | ((prev: T) => T)) => void;
    subscribe: (callback: () => void) => () => void;
    getInitState: () => T;
    storeTag: "zustand";
};
