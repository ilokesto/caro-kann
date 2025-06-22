import { useMemo, useSyncExternalStore } from "react";
import { deepCompare } from "../utils/deepCompare";
export function createUseStore(store, selector) {
    const getSelection = useMemo(() => {
        let hasMemo = false;
        let mStore;
        let mSelection;
        const mSelector = (nStore) => {
            if (!hasMemo) {
                hasMemo = true;
                mStore = nStore;
                const nSelection = selector(nStore);
                mSelection = nSelection;
                return nSelection;
            }
            const pStore = mStore;
            const pSelection = mSelection;
            if (deepCompare(pStore, nStore))
                return pSelection;
            const nSelection = selector(nStore);
            mStore = nStore;
            mSelection = nSelection;
            return nSelection;
        };
        return () => mSelector(store.getStore());
    }, [store, selector]);
    const value = useSyncExternalStore(store.subscribe, getSelection, getSelection);
    return [value, store.setStore];
}
