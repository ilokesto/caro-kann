export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    const setStore = (nextState) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        callbacks.forEach((cb) => cb());
    };
    return {
        setStore,
        getStore: () => store,
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        },
    };
};
