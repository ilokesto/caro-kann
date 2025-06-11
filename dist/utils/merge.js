import { createContext, useContext } from "react";
import { store_props, context_props } from "../types";
import { createUseStore } from "../core/CreateUseStore";
export const merge = (props, getStoreFrom) => {
    if (Object.keys(props).length > 8) {
        throw new Error("merge function can only merge up to 8 stores at a time. Please reduce the number of stores you are trying to merge.");
    }
    const rootObject = getStoreObjectFromRoot(props);
    function useMergedStores(selector = (state) => state) {
        const contextObject = useGetStoreObjectFromContext(props);
        const store = createMergeStore(getCorrectStore(rootObject, contextObject, getStoreFrom), selector);
        return createUseStore(store, selector);
    }
    const dummy = {};
    useMergedStores.readOnly = (selector = (state) => state) => useMergedStores(selector)[0];
    useMergedStores.writeOnly = () => useMergedStores(() => dummy)[1];
    return useMergedStores;
};
const getCorrectStore = (rootObject, contextObject, getStoreFrom) => {
    if (getStoreFrom === undefined)
        return contextObject;
    const result = { ...contextObject };
    for (const key in getStoreFrom) {
        if (getStoreFrom[key] === 'root') {
            result[key] = rootObject[key];
        }
        else if (getStoreFrom[key] === 'context') {
            continue;
        }
    }
    return result;
};
const createMergeStore = (storeObject, selector) => {
    const callbacks = new Set();
    let selected = {};
    const setStore = () => {
        const store = {};
        for (const key in storeObject) {
            const K = key;
            store[K] = storeObject[key].getStore();
        }
        return store;
    };
    let store = setStore();
    const setMergedStore = (nextState, actionName) => {
        const newState = typeof nextState === "function"
            ? nextState(setStore())
            : nextState;
        for (const key in storeObject) {
            const K = key;
            if (store[K] !== newState[K])
                storeObject[K].setStore(newState[K], actionName);
        }
        callbacks.forEach((cb) => cb());
    };
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
        subscribe,
        getStore: () => store,
        setStore: setMergedStore,
        getSelected: () => selected,
        setSelected: (selector) => {
            const s = selector(store);
            const isSelected = typeof s === 'object';
            if (isSelected)
                selected = s;
            return isSelected;
        },
    };
};
function getStoreObjectFromRoot(props) {
    const result = {};
    Object.keys(props).forEach(key => {
        result[key] = props[key][store_props];
    });
    return result;
}
const undefinedContext = createContext(undefined);
function useGetStoreObjectFromContext(props) {
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
