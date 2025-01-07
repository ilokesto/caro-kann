import { createReducerStore } from "../core/createReducerStore";
export function reducer(reducer, initialState) {
    return [createReducerStore(reducer, initialState), "reducer"];
}
