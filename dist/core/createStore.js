export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    let selected = {};
    const setStore = (nextState, actionName, selector) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        callbacks.forEach((cb) => cb());
    };
    const setSelected = (selector) => {
        const s = selector(store);
        const isSelected = typeof s === 'object';
        if (isSelected)
            selected = s;
        return isSelected;
    };
    return {
        setStore,
        getStore: (init) => init ? initState : store,
        getSelected: () => selected,
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        },
        setSelected
    };
};
