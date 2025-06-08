import { useSyncExternalStore } from "react";
const createMergeStore = (stores) => {
    const subscribers = new Set();
    let selected = {};
    let state = {};
    const getStoreFromContext = (key) => {
        return stores[key].context._currentValue;
    };
    const mergedStore = {
        getStore: (mode) => {
            for (const key in stores) {
                const storeFromContext = getStoreFromContext(key);
                state[key] = storeFromContext.getStore(mode);
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
                    const storeFromContext = getStoreFromContext(key);
                    storeFromContext.setStore(() => nextState[key], actionName);
                }
            }
            if (selector)
                selected = selector(nextState);
            subscribers.forEach(callback => callback());
        },
        subscribe: (callback) => {
            subscribers.add(callback);
            const unsubscribes = Object.keys(stores).map(key => {
                const storeFromContext = getStoreFromContext(key);
                return storeFromContext.subscribe(() => {
                    state[key] = storeFromContext.getStore();
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
    return mergedStore;
};
export const merge = (stores) => {
    function useStore(selector = (state) => state) {
        const { getStore, setStore, subscribe, getSelected, setSelected } = createMergeStore(stores);
        const s = selector(getStore());
        const isSelected = typeof s === 'object';
        if (isSelected)
            setSelected(s);
        const board = useSyncExternalStore(subscribe, isSelected ? getSelected : () => selector(getStore()), isSelected ? getSelected : () => selector(getStore('init')));
        return [
            board,
            isSelected
                ? (nextState) => {
                    setStore(nextState, "setStoreAction", selector);
                }
                : setStore
        ];
    }
    ;
    return useStore;
};
