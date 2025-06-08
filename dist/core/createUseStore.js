import { useSyncExternalStore } from "react";
export function createUseStore(store) {
    return function useStore(selector = (state) => state) {
        const { getStore, setStore, subscribe, getSelected, setSelected } = store();
        const s = selector(getStore());
        const isSelected = typeof s === 'object';
        if (isSelected)
            setSelected(s);
        const board = useSyncExternalStore(subscribe, isSelected ? getSelected : () => selector(getStore()), isSelected ? getSelected : () => selector(getStore('init')));
        return [
            board,
            (nextState) => setStore(nextState, "setStoreAction", selector)
        ];
    };
}
