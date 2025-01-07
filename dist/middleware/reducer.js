import { createReducerStore } from "../core/createReducerStore";
import { createStore } from "../core/createStore";
export function reducer(reducer, initialState) {
    return [createReducerStore(reducer, createStore(initialState)), "reducer"];
}
