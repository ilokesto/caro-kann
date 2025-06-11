export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    let selected = {};
    const setStore = (nextState, actionName, selector) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        if (selector)
            selected = selector(store);
        callbacks.forEach((cb) => cb());
    };
    return {
        setStore,
        getStore: (init) => init ? initState : store,
        getSelected: () => selected,
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        },
        isSelected: typeof selected === 'object' && Object.keys(selected).length > 0,
    };
};
