import { useMemo, useSyncExternalStore } from "react";
import { deepCompare } from "../utils/deepCompare";
export function createUseStore({ getStore, setStore, subscribe }, selector) {
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
        return () => mSelector(getStore());
    }, [getStore, selector]);
    const value = useSyncExternalStore(subscribe, getSelection, getSelection);
    return [value, setStore];
}
