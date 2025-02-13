export const createStore = (initState) => {
    const callbacks = new Set();
    let store = initState;
    const setStore = (nextState) => {
        store = typeof nextState === "function" ? nextState(store) : nextState;
        callbacks.forEach((cb) => cb());
    };
    const getStore = () => store;
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    return { getStore, setStore, subscribe, getInitState: () => initState };
};
export class CreateStore {
    _callbacks = new Set();
    _store;
    _initStore;
    constructor(initStore) {
        this._store = initStore;
        this._initStore = initStore;
    }
    getInitState = () => this._initStore;
    getStore = () => this._store;
    setStore = (nextState) => {
        this._store = typeof nextState === "function" ? nextState(this._store) : nextState;
        this._callbacks.forEach((cb) => cb());
    };
    subscribe = (callback) => {
        this._callbacks.add(callback);
        return () => this._callbacks.delete(callback);
    };
}
