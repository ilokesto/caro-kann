export function createStore(initState) {
    let store = initState;
    const callbacks = new Set();
    return {
        getStore: () => store,
        setStore: (nextState) => {
            store = typeof nextState === "function"
                ? nextState(store)
                : nextState;
            callbacks.forEach((cb) => cb());
        },
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        }
    };
}
