import { createUseStore } from "../core/createUseStore";
export const merge = (stores) => {
    const subscribers = new Set();
    let selected = {};
    const unsubscribes = [];
    for (const key in stores) {
        const unsubscribe = stores[key].store.subscribe(() => {
            subscribers.forEach(callback => callback());
        });
        unsubscribes.push(unsubscribe);
    }
    const mergedStore = {
        getStore: () => {
            const state = {};
            for (const key in stores) {
                state[key] = stores[key].store.getStore();
            }
            return state;
        },
        setStore: (action, actionName, selector) => {
            const prevState = mergedStore.getStore();
            const nextState = typeof action === 'function'
                ? action(prevState)
                : action;
            for (const key in stores) {
                if (key in nextState && nextState[key] !== prevState[key]) {
                    stores[key].store.setStore(nextState[key], actionName);
                }
            }
            if (selector)
                selected = selector(nextState);
            subscribers.forEach(callback => callback());
        },
        subscribe: (callback) => {
            subscribers.add(callback);
            return () => {
                subscribers.delete(callback);
            };
        },
        getSelected: () => selected,
        setSelected: (value) => { selected = value; },
    };
    const useStore = createUseStore(() => mergedStore);
    return useStore;
};
