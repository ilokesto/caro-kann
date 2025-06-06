import { selected } from "../types";
export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    const storage = { [selected]: {} };
    const setStore = (nextState, actionName, selector) => {
        store = typeof nextState === "function"
            ? nextState(store)
            : nextState;
        if (selector) {
            setSelected(selector(store));
        }
        callbacks.forEach((cb) => cb());
    };
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    const getStore = () => store;
    const getInitState = () => initState;
    const setSelected = (value) => {
        storage[selected] = value;
    };
    const getSelected = () => storage[selected];
    return {
        setStore,
        subscribe,
        getStore,
        getInitState,
        setSelected,
        getSelected,
    };
};
