export const createReducerStore = (reducer, Store) => {
    const setStore = (action) => {
        Store.setStore(prev => reducer(prev, action));
    };
    return { ...Store, setStore };
};
