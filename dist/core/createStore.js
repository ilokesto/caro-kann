export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    let selected = {};
    let isSelectedInit = false;
    const setStore = (nextState, actionName, selector) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        if (selector)
            selected = selector(store);
        callbacks.forEach((cb) => cb());
    };
    const getSnapshot = (selector) => {
        if (!isSelectedInit) {
            selected = selector(store);
            isSelectedInit = true;
        }
        if (typeof selected === "object" && Object.keys(selected).length > 0) {
            return selected;
        }
        else {
            return selector(store);
        }
    };
    return {
        setStore,
        getStore: (init) => init ? initState : store,
        getSnapshot,
        subscribe: (callback) => {
            callbacks.add(callback);
            return () => callbacks.delete(callback);
        },
    };
};
