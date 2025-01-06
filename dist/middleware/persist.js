import { createPersistBoard } from "../core/createPersistBoard";
export function persist(initialState, options) {
    return createPersistBoard(initialState, options);
}
