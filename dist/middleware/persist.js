import { createPersistBoard } from "../core/createPersistStore";
export function persist(initialState, options) {
    return createPersistBoard(initialState, options);
}
