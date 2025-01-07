export function createZustandStore(initFn) {
    let store;
    const callbacks = new Set();
    const getStore = () => store;
    const setStore = (nextState) => {
        store = typeof nextState === "function" ? nextState(store) : { ...store, ...nextState };
        callbacks.forEach((callback) => callback());
    };
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => {
            callbacks.delete(callback);
        };
    };
    store = initFn(setStore, getStore);
    return { getStore, setStore, subscribe, getInitState: () => store };
}
;
