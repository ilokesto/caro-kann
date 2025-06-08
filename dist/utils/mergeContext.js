import { createUseStore } from "../core/createUseStore";
const createMergedStore = (stores, getContext) => {
    const subscribers = new Set();
    let selected = {};
    const setupSubscriptions = (callback) => {
        const unsubscribes = [];
        for (const key in stores) {
            const unsubscribe = getContext(key).subscribe(() => {
                callback();
            });
            unsubscribes.push(unsubscribe);
        }
        return unsubscribes;
    };
    const mergedStore = {
        getStore: () => {
            const state = {};
            for (const key in stores) {
                state[key] = getContext(key).getStore();
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
                    getContext(key).setStore(nextState[key], actionName);
                }
            }
            if (selector) {
                selected = selector(nextState);
            }
            subscribers.forEach(callback => callback());
        },
        subscribe: (callback) => {
            subscribers.add(callback);
            const unsubscribes = setupSubscriptions(callback);
            return () => {
                subscribers.delete(callback);
                unsubscribes.forEach(unsubscribe => unsubscribe());
            };
        },
        getSelected: () => selected,
        setSelected: (value) => { selected = value; },
    };
    return mergedStore;
};
export const mergeContext = (stores) => {
    const getContext = (key) => {
        return stores[key].ContextStore._currentValue;
    };
    return createUseStore(() => createMergedStore(stores, getContext));
};
