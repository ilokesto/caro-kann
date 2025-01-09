import { createStore } from "../core/createStore";
export const zustand = (initFn) => {
    const Store = createStore({});
    const setStore = (nextState) => Store.setStore(prev => typeof nextState === "function" ? nextState(prev) : { ...prev, ...nextState });
    Store.setStore(initFn(setStore, Store.getStore, { ...Store, setStore }));
    return [{ ...Store, setStore }, "zustand"];
};
