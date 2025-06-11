import { useSyncExternalStore } from "react";
export function createUseStore(store, selector) {
    const { getSnapshot, setStore, subscribe } = store;
    const board = useSyncExternalStore(subscribe, () => getSnapshot(selector), () => getSnapshot(selector));
    return [
        board,
        (nextState) => {
            setStore(nextState, "setStoreAction", selector);
        }
    ];
}
