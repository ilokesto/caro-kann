import { useSyncExternalStore } from "react";
export function createUseStore(store, selector) {
    const { getStore, setStore, subscribe, getSelected, setSelected } = store;
    const isSelected = setSelected(selector);
    const board = useSyncExternalStore(subscribe, isSelected ? getSelected : () => selector(getStore()), isSelected ? getSelected : () => selector(getStore('init')));
    return [
        board,
        (nextState) => setStore(nextState, "setStoreAction", selector)
    ];
}
