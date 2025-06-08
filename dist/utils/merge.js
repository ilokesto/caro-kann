import { useSyncExternalStore } from "react";
export const merge = (props, getStoreForm = 'context') => {
    function useMergedStores(selector = (state) => state) {
        const { getStore, subscribe, setSelected, getSelected } = createMergeStore(props, getValue(props, getStoreForm));
        const s = selector(getStore());
        const isSelected = typeof s === 'object';
        if (isSelected)
            setSelected(s);
        const state = useSyncExternalStore(subscribe, isSelected ? getSelected : () => selector(getStore()), isSelected ? getSelected : () => selector(getStore()));
        return state;
    }
    return useMergedStores;
};
const createMergeStore = (props, getValue) => {
    const store = {};
    const callbacks = new Set();
    let selected = {};
    const getStore = () => {
        for (const key in props) {
            const K = key;
            store[K] = getValue(K).getStore();
        }
        return store;
    };
    const subscribe = (callback) => {
        callbacks.add(callback);
        const unsubscribers = new Set();
        for (const key in props) {
            const K = key;
            const unsubscribe = getValue(K).subscribe(() => {
                callbacks.forEach(cb => cb());
            });
            unsubscribers.add(unsubscribe);
        }
        return () => {
            callbacks.delete(callback);
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    };
    return { getStore, subscribe,
        setSelected: (value) => { selected = value; },
        getSelected: () => selected };
};
function getValue(props, getStoreForm) {
    switch (getStoreForm) {
        case 'root':
            return (key) => props[key].store;
        case 'context':
            return (key) => props[key].context._currentValue;
        default:
            throw new Error('Invalid getStoreForm');
    }
}
