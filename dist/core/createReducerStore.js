export const createReducerStore = (reducer, initState) => {
    const callbacks = new Set();
    let store = initState;
    const setStore = (action) => {
        store = reducer(store, action);
        callbacks.forEach((cb) => cb());
    };
    const getStore = () => store;
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    return { getStore, setStore, subscribe, getInitState: () => initState };
};
