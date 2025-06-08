import { store_property } from "../types";
import { createUseStore } from "../core/createUseStore";
export const merge = (stores) => createUseStore(() => createMergeStore(stores));
function createMergeStore(stores) {
    const subscribers = new Set();
    let selected = {};
    let state = { test: 'test' };
    const getStore = (mode) => {
        for (const key in stores) {
            const storeFromContext = stores[key][store_property];
            state[key] = storeFromContext.getStore(mode);
        }
        return state;
    };
    const setStore = (action, actionName, selector) => {
        const prevState = getStore();
        const nextState = typeof action === 'function'
            ? action(prevState)
            : action;
        for (const key in stores) {
            if (key in nextState && nextState[key] !== prevState[key]) {
                const store = stores[key][store_property];
                store.setStore(() => nextState[key], actionName);
            }
        }
        if (selector)
            selected = selector(nextState);
        subscribers.forEach(callback => callback());
    };
    return {
        getStore,
        setStore,
        subscribe: (callback) => {
            subscribers.add(callback);
            const unsubscribes = Object.keys(stores).map(key => {
                const store = stores[key][store_property];
                return store.subscribe(() => {
                    state[key] = store.getStore();
                    callback();
                });
            });
            return () => {
                subscribers.delete(callback);
                unsubscribes.forEach(unsubscribe => unsubscribe());
            };
        },
        getSelected: () => selected,
        setSelected: (value) => { selected = value; },
    };
}
;
