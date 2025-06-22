export class CreateStore {
    store;
    callbacks = new Set();
    constructor(initState) { this.store = initState; }
    ;
    getStore() { return this.store; }
    setStore(nextState) {
        this.store = typeof nextState === "function"
            ? nextState(this.store)
            : nextState;
        this.callbacks.forEach((cb) => cb());
    }
    subscribe(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
}
