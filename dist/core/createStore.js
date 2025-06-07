export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    let storage = {};
    const setStore = (nextState, actionName, selector) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        if (selector) {
            setSelected(selector(store));
        }
        callbacks.forEach((cb) => cb());
    };
    const setSelected = (value) => { storage = value; };
    return {
        setStore,
        setSelected,
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        },
        getStore: (init) => init ? initState : store,
        getSelected: () => storage,
    };
};
