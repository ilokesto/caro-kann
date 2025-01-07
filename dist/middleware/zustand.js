import { createStore } from "../core/createStore";
export function zustand(initFn) {
    const Store = createStore({});
    const setStore = (nextState) => {
        Store.setStore(prev => typeof nextState === "function" ? nextState(prev) : { ...prev, ...nextState });
    };
    Store.setStore(initFn(setStore, Store.getStore, { getStore: Store.getStore, setStore, subscribe: Store.subscribe }));
    return [{ ...Store, setStore }, "zustand"];
}
