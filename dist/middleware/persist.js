import { createPersistBoard } from "../core/createPersistStore";
import { createStore } from "../core/createStore";
export function persist(initialState, options) {
    return [createPersistBoard(createStore(initialState), options), "persist"];
}
