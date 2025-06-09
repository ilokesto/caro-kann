import { createContext } from "vm";
import { store_props, context_props } from "../types";
import { useContext, useSyncExternalStore } from "react";
export const merge = (props, getStoreFrom = 'context') => {
    const storeObject = getStoreObjectFromProps(props);
    return function useMergedStores(selector = (state) => state) {
        const contextObject = useGetStoreObjectFromProps(props);
        const { getStore, subscribe, getSelected } = createMergeStore(getStoreFrom === 'context' ? contextObject : storeObject, selector);
        const state = useSyncExternalStore(subscribe, typeof getSelected === 'object' ? getSelected : () => selector(getStore()), typeof getSelected === 'object' ? getSelected : () => selector(getStore()));
        return state;
    };
};
const createMergeStore = (storeObject, selector) => {
    const callbacks = new Set();
    const setStore = () => {
        const store = {};
        for (const key in storeObject) {
            const K = key;
            store[K] = storeObject[key].getStore();
        }
        return store;
    };
    let store = setStore();
    let selected = selector(store);
    const getStore = () => store;
    const subscribe = (callback) => {
        callbacks.add(callback);
        const unsubscribers = new Set();
        for (const key in storeObject) {
            const K = key;
            const unsubscribe = storeObject[K].subscribe(() => {
                store = setStore();
                selected = selector(store);
                callbacks.forEach(cb => cb());
            });
            unsubscribers.add(unsubscribe);
        }
        return () => {
            callbacks.delete(callback);
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    };
    return {
        getStore,
        subscribe,
        setSelected: (value) => { selected = value; },
        getSelected: () => selected
    };
};
function getStoreObjectFromProps(props) {
    return Object.keys(props).reduce((acc, key) => {
        const k = key;
        acc[k] = props[key][store_props];
        return acc;
    }, {});
}
const undefinedContext = createContext(undefined);
function useGetStoreObjectFromProps(props) {
    const taggedObject = Object.keys(props).reduce((acc, key, index) => {
        acc[index] = key;
        return acc;
    }, {});
    const zero = useContext(props[taggedObject[0]]?.[context_props] ?? undefinedContext);
    const one = useContext(props[taggedObject[1]]?.[context_props] ?? undefinedContext);
    const two = useContext(props[taggedObject[2]]?.[context_props] ?? undefinedContext);
    const three = useContext(props[taggedObject[3]]?.[context_props] ?? undefinedContext);
    const four = useContext(props[taggedObject[4]]?.[context_props] ?? undefinedContext);
    const five = useContext(props[taggedObject[5]]?.[context_props] ?? undefinedContext);
    const six = useContext(props[taggedObject[6]]?.[context_props] ?? undefinedContext);
    const seven = useContext(props[taggedObject[7]]?.[context_props] ?? undefinedContext);
    const contextArray = [zero, one, two, three, four, five, six, seven].filter(context => context !== undefined);
    return contextArray.reduce((acc, key, index) => {
        const originalKey = taggedObject[index];
        acc[originalKey] = contextArray[index];
        return acc;
    }, {});
}
