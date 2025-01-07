import { createStore } from "../core/createStore";
export function reducer(reducer, initialState) {
    const Store = createStore(initialState);
    const setStore = (action) => {
        Store.setStore(prev => reducer(prev, action));
    };
    return [{ ...Store, setStore }, "reducer"];
}
