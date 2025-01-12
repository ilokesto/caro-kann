import { createStore } from "../core/createStore";
export const reducer = (reducer, initState) => {
    const Store = initState instanceof Array ? initState[0] : createStore(initState);
    const setStore = (action) => {
        Store.setStore(prev => reducer(prev, action));
    };
    return [{ ...Store, setStore }, "reducer"];
};
